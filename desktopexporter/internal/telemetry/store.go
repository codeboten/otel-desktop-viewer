package telemetry

import (
	"container/list"
	"context"
	"fmt"
	"sync"
)

type Store struct {
	maxQueueSize int
	mut          sync.Mutex
	queue        *list.List
	telemetryMap map[string]TelemetryData
}

func NewTelemetryStore(maxQueueSize int) *Store {
	return &Store{
		maxQueueSize: maxQueueSize,
		mut:          sync.Mutex{},
		queue:        list.New(),
		telemetryMap: map[string]TelemetryData{},
	}
}

func (store *Store) AddMetric(_ context.Context, md MetricData) {
	store.mut.Lock()
	defer store.mut.Unlock()
	// TODO: enqueue metric
}

func (store *Store) AddLog(_ context.Context, ld LogData) {
	store.mut.Lock()
	defer store.mut.Unlock()
	// TODO: enqueue log
}

func (store *Store) AddSpan(_ context.Context, spanData SpanData) {
	store.mut.Lock()
	defer store.mut.Unlock()

	// Enqueue, then append, as the enqueue process checks if the traceID is already in the map to keep the trace alive
	store.enqueueTrace(spanData.TraceID)
	td, traceExists := store.telemetryMap[spanData.TraceID]
	if !traceExists {
		td = TelemetryData{
			ID:   spanData.TraceID,
			Type: "trace",
			Trace: TraceData{
				TraceID: spanData.TraceID,
				Spans:   []SpanData{},
			},
		}
	}
	td.Trace.Spans = append(td.Trace.Spans, spanData)
	store.telemetryMap[spanData.TraceID] = td
}

func (store *Store) GetTrace(traceID string) (TraceData, error) {
	store.mut.Lock()
	defer store.mut.Unlock()

	trace, traceExists := store.telemetryMap[traceID]
	if !traceExists {
		return TraceData{}, ErrTraceIDNotFound
	}

	return trace.Trace, nil
}

func (store *Store) GetRecentTraces(traceCount int) []TraceData {
	store.mut.Lock()
	defer store.mut.Unlock()

	recentIDs := store.getRecentTraceIDs(traceCount)
	recentTraces := make([]TraceData, 0, len(recentIDs))

	for _, traceID := range recentIDs {
		trace, traceExists := store.telemetryMap[traceID]
		if !traceExists {
			fmt.Printf("error: %s\t traceID: %s\n", ErrTraceIDNotFound, traceID)
		} else {
			recentTraces = append(recentTraces, trace.Trace)
		}
	}

	return recentTraces
}

func (store *Store) ClearTraces() {
	store.mut.Lock()
	defer store.mut.Unlock()

	store.queue = list.New()
	store.telemetryMap = map[string]TelemetryData{}
}

func (store *Store) enqueueTrace(traceID string) {
	// If the traceID is already in the queue, move it to the front of the line
	_, traceIDExists := store.telemetryMap[traceID]
	if traceIDExists {
		element := store.findQueueElement(traceID)
		if element == nil {
			fmt.Println(ErrTraceIDMismatch)
		}

		store.queue.MoveToFront(element)
	} else {
		// If we have exceeded the maximum number of traces we plan to store
		// make room for the trace in the queue by deleting the oldest trace
		for store.queue.Len() >= store.maxQueueSize {
			store.dequeueTrace()
		}
		// Add traceID to the front of the queue with the most recent traceIDs
		store.queue.PushFront(traceID)
	}
}

func (store *Store) dequeueTrace() {
	expiringTraceID := store.queue.Back().Value.(string)
	delete(store.telemetryMap, expiringTraceID)
	store.queue.Remove(store.queue.Back())
}

func (store *Store) findQueueElement(traceID string) *list.Element {
	for element := store.queue.Front(); element != nil; element = element.Next() {
		if traceID == element.Value.(string) {
			return element
		}
	}
	return nil
}

func (store *Store) getRecentTraceIDs(traceCount int) []string {
	if traceCount > store.queue.Len() {
		traceCount = store.queue.Len()
	}

	recentTraceIDs := make([]string, 0, traceCount)
	element := store.queue.Front()

	for i := 0; i < traceCount; i++ {
		recentTraceIDs = append(recentTraceIDs, element.Value.(string))
		element = element.Next()
	}

	return recentTraceIDs
}
