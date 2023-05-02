package desktopexporter

import (
	"container/list"
	"context"
	"fmt"
	"sync"
)

type TelemetryStore struct {
	maxQueueSize int
	mut          sync.Mutex
	traceQueue   *list.List
	telemetryMap map[string]TelemetryData
}

func NewTraceStore(maxQueueSize int) *TelemetryStore {
	return &TelemetryStore{
		maxQueueSize: maxQueueSize,
		mut:          sync.Mutex{},
		traceQueue:   list.New(),
		telemetryMap: map[string]TelemetryData{},
	}
}

func (store *TelemetryStore) AddMetric(_ context.Context, md MetricData) {
	store.mut.Lock()
	defer store.mut.Unlock()
	// TODO: figure out the right ID for metric
	id := "test-metric"
	store.enqueueTelemetry(id)
	store.telemetryMap[id] = TelemetryData{
		TelemetryID: id,
		Type:        "metric",
		Metric:      md,
	}
}

func (store *TelemetryStore) AddLog(_ context.Context, ld LogData) {
	store.mut.Lock()
	defer store.mut.Unlock()
	// TODO: figure out the right ID for logs
	id := "test-log"
	store.enqueueTelemetry(id)
	store.telemetryMap[id] = TelemetryData{
		TelemetryID: id,
		Type:        "log",
		Log:         ld,
	}
}

func (store *TelemetryStore) AddSpan(_ context.Context, spanData SpanData) {
	store.mut.Lock()
	defer store.mut.Unlock()

	// Enqueue, then append, as the enqueue process checks if the traceID is already in the map to keep the trace alive
	store.enqueueTelemetry(spanData.TraceID)
	traceData, traceExists := store.telemetryMap[spanData.TraceID]
	if !traceExists { // TODO: check if type matches
		traceData = TelemetryData{
			TelemetryID: spanData.TraceID,
			Type:        "trace",
			Trace: TraceData{
				TraceID: spanData.TraceID,
				Spans:   []SpanData{},
			},
		}
	}
	traceData.Trace.Spans = append(traceData.Trace.Spans, spanData)
	store.telemetryMap[spanData.TraceID] = traceData
}

func (store *TelemetryStore) GetTelemetry(traceID string) (TelemetryData, error) {
	store.mut.Lock()
	defer store.mut.Unlock()

	trace, traceExists := store.telemetryMap[traceID]
	if !traceExists {
		return TelemetryData{}, ErrTraceIDNotFound
	}

	return trace, nil
}

func (store *TelemetryStore) GetRecentTelemetry(traceCount int) []TelemetryData {
	store.mut.Lock()
	defer store.mut.Unlock()

	recentIDs := store.getRecentTelemetryIDs(traceCount)
	recentTelemetry := make([]TelemetryData, 0, len(recentIDs))

	for _, traceID := range recentIDs {
		telemetry, telemetryExists := store.telemetryMap[traceID]
		if !telemetryExists {
			fmt.Printf("error: %s\t telemetryID: %s\n", ErrTraceIDNotFound, traceID)
		} else {
			recentTelemetry = append(recentTelemetry, telemetry)
		}
	}

	return recentTelemetry
}

func (store *TelemetryStore) ClearTraces() {
	store.mut.Lock()
	defer store.mut.Unlock()

	store.traceQueue = list.New()
	store.telemetryMap = map[string]TelemetryData{}
}

func (store *TelemetryStore) enqueueTelemetry(traceID string) {
	// If the traceID is already in the queue, move it to the front of the line
	_, traceIDExists := store.telemetryMap[traceID]
	if traceIDExists {
		element := store.findQueueElement(traceID)
		if element == nil {
			fmt.Println(ErrTraceIDMismatch)
		}

		store.traceQueue.MoveToFront(element)
	} else {
		// If we have exceeded the maximum number of traces we plan to store
		// make room for the trace in the queue by deleting the oldest trace
		for store.traceQueue.Len() >= store.maxQueueSize {
			store.dequeueTelemetry()
		}
		// Add traceID to the front of the queue with the most recent traceIDs
		store.traceQueue.PushFront(traceID)
	}
}

func (store *TelemetryStore) dequeueTelemetry() {
	expiringTraceID := store.traceQueue.Back().Value.(string)
	delete(store.telemetryMap, expiringTraceID)
	store.traceQueue.Remove(store.traceQueue.Back())
}

func (store *TelemetryStore) findQueueElement(traceID string) *list.Element {
	for element := store.traceQueue.Front(); element != nil; element = element.Next() {
		if traceID == element.Value.(string) {
			return element
		}
	}
	return nil
}

func (store *TelemetryStore) getRecentTelemetryIDs(traceCount int) []string {
	if traceCount > store.traceQueue.Len() {
		traceCount = store.traceQueue.Len()
	}

	recentTraceIDs := make([]string, 0, traceCount)
	element := store.traceQueue.Front()

	for i := 0; i < traceCount; i++ {
		recentTraceIDs = append(recentTraceIDs, element.Value.(string))
		element = element.Next()
	}

	return recentTraceIDs
}
