'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { pipelineOrder } from '@/lib/pipeline'

import { DndContext, DragEndEvent, useDroppable, useDraggable } from '@dnd-kit/core'

export default function Pipeline() {
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase.from('leads').select('*')
    setLeads(data || [])
  }

  async function updateStage(id: string, stage: string) {
    await supabase.from('leads').update({ stage }).eq('id', id)
    load()
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    updateStage(active.id as string, over.id as string)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 CRM Pipeline Atlas</h1>

      <DndContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
          {pipelineOrder.map((stage) => (
            <Column
              key={stage}
              id={stage}
              title={stage}
              leads={leads.filter((l) => l.stage === stage)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
}

function Column({ id, title, leads }: any) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        minWidth: 260,
        minHeight: 500,
        background: '#0f0f0f',
        padding: 12,
        borderRadius: 10,
        color: '#fff'
      }}
    >
      <h3 style={{ marginBottom: 10 }}>{title.toUpperCase()}</h3>

      {leads.map((lead: any) => (
        <Card key={lead.id} lead={lead} />
      ))}
    </div>
  )
}

function Card({ lead }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: 10,
        marginBottom: 10,
        background: '#1f1f1f',
        borderRadius: 8,
        cursor: 'grab',
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined
      }}
    >
      <strong>{lead.name}</strong>
      <div style={{ fontSize: 12 }}>{lead.phone}</div>
    </div>
  )
}
