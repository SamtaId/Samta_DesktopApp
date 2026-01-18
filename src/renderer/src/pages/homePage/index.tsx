// import React, { useState } from 'react'
// import { Box, Typography, Tabs, Tab, Paper, Stack, Grid, Card, CardContent } from '@mui/material'
// import { Button, Chip } from '@mui/material'
// import { AccessTime } from '@mui/icons-material'
// import { useIndex } from './hook/useIndex'
// import { ITransaction } from '@renderer/interface/transaction.interface'

// const OrderCard: React.FC<{
//   order: ITransaction
//   onStatusChange: (id: number, status: ITransaction['status']) => void
// }> = ({ order, onStatusChange }) => {
//   const statusConfig = {
//     pending: {
//       label: 'Menunggu',
//       btnColor: '#ef4444',
//       btnLabel: 'Mulai Masak',
//       nextStatus: 'cooking' as const
//     },
//     cooking: {
//       label: 'Dimasak',
//       btnColor: '#3b82f6',
//       btnLabel: 'Selesai',
//       nextStatus: 'done' as const
//     },
//     done: {
//       label: 'Selesai',
//       btnColor: '#22c55e',
//       btnLabel: null,
//       nextStatus: null
//     }
//   }

//   const config = statusConfig[order.status]

//   return (
//     <Paper
//       variant="outlined"
//       sx={{
//         p: 2,
//         borderRadius: 2,
//         borderColor: '#e2e8f0',
//         bgcolor: 'white'
//       }}
//     >
//       {/* Row 1: Menu & Status */}
//       <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
//         <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1e293b' }}>
//           {order.menu}
//         </Typography>
//         <Chip
//           label={config.label}
//           size="small"
//           sx={{
//             bgcolor: config.btnColor,
//             color: 'white',
//             fontWeight: 600,
//             fontSize: '0.7rem',
//             height: 24
//           }}
//         />
//       </Stack>

//       {/* Row 2: Details */}
//       <Stack direction="row" spacing={3} mb={1.5}>
//         <Box>
//           <Typography variant="caption" sx={{ color: '#94a3b8' }}>
//             Meja
//           </Typography>
//           <Typography variant="body2" fontWeight={600} sx={{ color: '#334155' }}>
//             {order.tableNumber || '-'}
//           </Typography>
//         </Box>
//         <Box>
//           <Typography variant="caption" sx={{ color: '#94a3b8' }}>
//             Jumlah
//           </Typography>
//           <Typography variant="body2" fontWeight={600} sx={{ color: '#334155' }}>
//             {order.qty}x
//           </Typography>
//         </Box>
//         <Box>
//           <Typography variant="caption" sx={{ color: '#94a3b8' }}>
//             Waktu
//           </Typography>
//           <Stack direction="row" spacing={0.5} alignItems="center">
//             <AccessTime sx={{ fontSize: 14, color: '#64748b' }} />
//             <Typography variant="body2" fontWeight={500} sx={{ color: '#334155' }}>
//               {order.orderTime}
//             </Typography>
//           </Stack>
//         </Box>
//       </Stack>

//       {/* Row 3: Note */}
//       {order.note && (
//         <Box sx={{ bgcolor: '#fef9c3', borderRadius: 1, px: 1.5, py: 1, mb: 1.5 }}>
//           <Typography variant="body2" sx={{ color: '#713f12', fontSize: '0.8rem' }}>
//             <strong>Catatan:</strong> {order.note}
//           </Typography>
//         </Box>
//       )}

//       {/* Row 4: Action */}
//       {config.btnLabel && config.nextStatus && (
//         <Button
//           variant="contained"
//           fullWidth
//           size="small"
//           onClick={() => onStatusChange(order.id, config.nextStatus)}
//           sx={{
//             bgcolor: config.btnColor,
//             color: 'white',
//             fontWeight: 600,
//             py: 1,
//             textTransform: 'none',
//             boxShadow: 'none',
//             '&:hover': {
//               bgcolor: config.btnColor,
//               opacity: 0.9,
//               boxShadow: 'none'
//             }
//           }}
//         >
//           {config.btnLabel}
//         </Button>
//       )}
//     </Paper>
//   )
// }

// export const HomePage: React.FC = () => {
//   const { orders, stats, updateOrderStatus, getOrdersByStatus } = useIndex()
//   const [activeTab, setActiveTab] = useState(0)

//   const tabFilters: Array<ITransaction['status'] | 'all'> = ['all', 'pending', 'cooking', 'done']
//   const filteredOrders =
//     activeTab === 0 ? orders : getOrdersByStatus(tabFilters[activeTab] as ITransaction['status'])

//   return (
//     <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', p: 2 }}>
//       <Box maxWidth="900px" mx="auto">
//         {/* Header */}
//         <Stack direction="column" justifyContent="space-between" alignItems="" mb={3}>
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="h6" fontWeight={700} sx={{ color: '#1e293b' }}>
//               Daftar Pesanan
//             </Typography>
//             <Typography variant="body2" sx={{ color: '#64748b' }}>
//               {stats.total} pesanan aktif
//             </Typography>
//           </Box>
//           <Grid container spacing={2} sx={{ width: '100%' }}>
//             <Grid size={{ xs: 12, sm: 4 }}>
//               <Card variant="outlined" sx={{ borderColor: 'orange' }}>
//                 <CardContent sx={{ py: 2.5, px: 2 }}>
//                   <Typography variant="subtitle2" sx={{ color: 'orange' }}>
//                     MENUNGGU
//                   </Typography>
//                   <Typography variant="h4" fontWeight={800} sx={{ color: 'orange' }}>
//                     {stats.pending}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 4 }}>
//               <Card variant="outlined" sx={{ borderColor: 'blue' }}>
//                 <CardContent sx={{ py: 2.5, px: 2 }}>
//                   <Typography variant="subtitle2" sx={{ color: 'blue' }}>
//                     DIMASAK
//                   </Typography>
//                   <Typography variant="h4" fontWeight={800} sx={{ color: 'blue' }}>
//                     {stats.cooking}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 4 }}>
//               <Card variant="outlined" sx={{ borderColor: 'green' }}>
//                 <CardContent sx={{ py: 2.5, px: 2 }}>
//                   <Typography variant="subtitle2" sx={{ color: 'green' }}>
//                     SELESAI
//                   </Typography>
//                   <Typography variant="h4" fontWeight={800} sx={{ color: 'green' }}>
//                     {stats.done}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Stack>

//         {/* Tabs */}
//         <Paper
//           variant="outlined"
//           sx={{ mb: 2, borderRadius: 2, borderColor: '#e2e8f0', overflow: 'hidden' }}
//         >
//           <Tabs
//             value={activeTab}
//             onChange={(_, newValue) => setActiveTab(newValue)}
//             variant="fullWidth"
//             TabIndicatorProps={{ style: { backgroundColor: '#1e293b', height: 2 } }}
//             sx={{
//               bgcolor: 'white',
//               '& .MuiTab-root': {
//                 fontWeight: 500,
//                 fontSize: '0.85rem',
//                 py: 1.5,
//                 textTransform: 'none',
//                 color: '#64748b',
//                 '&.Mui-selected': { color: '#1e293b' }
//               }
//             }}
//           >
//             <Tab label="Semua" />
//             <Tab label="Menunggu" />
//             <Tab label="Dimasak" />
//             <Tab label="Selesai" />
//           </Tabs>
//         </Paper>

//         {/* Order List */}
//         {filteredOrders.length === 0 ? (
//           <Paper
//             variant="outlined"
//             sx={{ p: 4, textAlign: 'center', borderRadius: 2, borderColor: '#e2e8f0' }}
//           >
//             <Typography sx={{ color: '#94a3b8' }}>Tidak ada pesanan</Typography>
//           </Paper>
//         ) : (
//           <Stack spacing={1.5}>
//             {filteredOrders.map((order) => (
//               <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />
//             ))}
//           </Stack>
//         )}
//       </Box>
//     </Box>
//   )
// }

import React from 'react'

export const HomePage: React.FC = () => {
  return <div>HomePage</div>
}
