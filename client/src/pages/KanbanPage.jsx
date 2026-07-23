import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, Calendar, MapPin, GripVertical } from 'lucide-react'
import { useApplications, useUpdateStatus } from '../hooks/useApplications'

// ─── Column config ─────────────────────────────────────────────
const COLUMNS = [
  { id: 'Applied', label: 'Applied', color: 'bg-blue-500' },
  { id: 'Shortlisted', label: 'Shortlisted', color: 'bg-orange-500' },
  { id: 'Interview', label: 'Interview', color: 'bg-purple-500' },
  { id: 'Offer', label: 'Offer', color: 'bg-green-500' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-red-400' },
]

// ─── Application Card ──────────────────────────────────────────
const AppCard = ({ app, index }) => {
  const navigate = useNavigate()

  return (
    <Draggable draggableId={app._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white border rounded-xl p-3 mb-2 cursor-pointer transition-shadow
            ${snapshot.isDragging
              ? 'shadow-lg border-blue-200 rotate-1'
              : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
            }`}
          onClick={() => navigate(`/applications/${app._id}`)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-gray-600">
                  {app.company[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {app.company}
                </p>
                <p className="text-xs text-gray-500 truncate">{app.role}</p>
              </div>
            </div>
            <div
              {...provided.dragHandleProps}
              className="text-gray-300 hover:text-gray-400 flex-shrink-0 mt-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={14} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2.5">
            {app.location && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin size={10} /> {app.location}
              </span>
            )}
            {app.deadline && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={10} />
                {new Date(app.deadline).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

// ─── Kanban Column ─────────────────────────────────────────────
const KanbanColumn = ({ column, apps }) => {
  return (
    <div className="flex flex-col min-w-52 w-52 flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${column.color}`} />
        <span className="text-sm font-medium text-gray-700">{column.label}</span>
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {apps.length}
        </span>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-32 rounded-xl p-2 transition-colors
              ${snapshot.isDraggingOver
                ? 'bg-blue-50 border-2 border-dashed border-blue-200'
                : 'bg-gray-50'
              }`}
          >
            {apps.map((app, index) => (
              <AppCard key={app._id} app={app} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

// ─── Main Kanban Page ──────────────────────────────────────────
const KanbanPage = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useApplications()
  const updateStatus = useUpdateStatus()

  const applications = data?.data || []

  // Group applications by status
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter((app) => app.status === col.id)
    return acc
  }, {})

  const onDragEnd = (result) => {
    const { draggableId, source, destination } = result

    // Dropped outside a column
    if (!destination) return

    // Dropped in same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    // Status didn't change
    if (source.droppableId === destination.droppableId) return

    // Update status via API
    updateStatus.mutate({
      id: draggableId,
      status: destination.droppableId,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load applications. Please refresh.
      </div>
    )
  }

  return (
    <div className="p-6 h-screen flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Kanban board</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {applications.length} total applications — drag to update status
          </p>
        </div>
        <button
          onClick={() => navigate('/applications/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add application
        </button>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              apps={grouped[col.id] || []}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default KanbanPage