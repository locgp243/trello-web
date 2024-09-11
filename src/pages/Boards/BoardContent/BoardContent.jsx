import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { 
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

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

  useEffect(() => {
    setOrderColumns(mapOrder(board.columns, board.columnOrderIds, '_id'))
  }, [board])

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
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
