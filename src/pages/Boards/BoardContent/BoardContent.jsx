import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { 
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors

  // Nếu dùng pointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở phần tử kéo thả nhưng còn bug.
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Yếu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click cũng gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt được event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  //const sensors = useSensors(pointerSensor)
  // Ưu tiên kết hợp 2 loại sensor là mouse và touch để trải nghiệm trên mobile tốt nhất. Không bị bug.
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderColumns, setOrderColumns] = useState([])

  //Cùng một thời điểm chỉ có một phần tử (column or card) đang được kéo
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderColumns(mapOrder(board.columns, board.columnOrderIds, '_id'))
  }, [board])

  // Trigger khi bắt đầu kéo một phần tử
  const handleDragStart = (event) => {
    console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

  }

  // Trigger khi kết thúc hành động kéo một phần tử
  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event)
    const { active, over } = event

    // Kiểm tra, nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn để tránh lỗi)
    if (!over) return

    // Nếu vị trí kéo thả khác với vị trí ban đầu thì tiến hành lấy vị trí mới và vị trí cũ ra rồi sắp xếp lại vị trí mới
    if (active.id !== over.id) {
      //Lấy vị trí cũ từ active.
      const oldIndex = orderColumns.findIndex(c => c._id === active.id)

      //Lấy vị trí mới từ over
      const newIndex = orderColumns.findIndex(c => c._id === over.id)

      // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng các columns ban đầu.
      // Code của arrayMove: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderColumns, oldIndex, newIndex)
      // 2 cái consolog dữ liệu này dùng để gọi API
      // const dndOrderColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns', dndOrderedColumns)
      // console.log('dndOrderColumnsIds', dndOrderColumnsIds)

      // Cập nhật lại vị trí ban đầu
      setOrderColumns(dndOrderedColumns)
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  /**
   * Animation khi kéo thả phần tử - Test bằng cách kéo xong thả trực tiếp và nhìn phần giữ chỗ Overlay
   */

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}

        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
