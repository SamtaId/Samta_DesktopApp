import React, { useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Collapse
} from '@mui/material'
import {
  Menu as MenuIcon,
  // Dashboard as DashboardIcon,
  // CalendarMonth as CalendarIcon,
  // Hotel as RoomTypeIcon,
  // AttachMoney as RatePlanIcon,
  // MeetingRoom as RoomsIcon,
  // EventAvailable as AvailabilityIcon,
  // Assessment as ForecastIcon,
  // ShoppingCart as OrderIcon,
  // People as PeopleIcon,
  // Business as BusinessIcon,
  // Inventory as InventoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  PointOfSale as POSIcon,
  // Receipt as ReceiptIcon,
  AccountBalance as CashierIcon,
  SwapHoriz as TransactionIcon
  // LocalShipping as ConsignmentIcon,
  // KeyboardReturn as ReturnIcon
  // TableRestaurant as TableIcon,
  // Public as ChannelIcon,
  // TrendingUp as SalesMarketingIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut } from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon: React.ReactElement
  path?: string
  children?: MenuItem[]
  isHeader?: boolean
}

interface SidebarProps {
  logo?: string
  onLogout?: () => void
}

const DRAWER_WIDTH = 280
const DRAWER_WIDTH_COLLAPSED = 72

export const Sidebar: React.FC<SidebarProps> = ({ logo, onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['point-of-sale'])

  const menuItems: MenuItem[] = [
    // {
    //   id: 'dashboard',
    //   label: 'DASHBOARD',
    //   icon: <DashboardIcon />,
    //   children: [
    //     { id: 'dashboard-main', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    //     { id: 'calendar', label: 'Calendar', icon: <CalendarIcon />, path: '/calendar' }
    //   ]
    // },
    // {
    //   id: 'fb-operations',
    //   label: 'F&B OPERATIONS',
    //   icon: <BusinessIcon />,
    //   isHeader: true
    // },
    // {
    //   id: 'products',
    //   label: 'Products',
    //   icon: <InventoryIcon />,
    //   children: [
    //     { id: 'product-list', label: 'Product List', icon: <InventoryIcon />, path: '/products' },
    //     {
    //       id: 'categories',
    //       label: 'Categories',
    //       icon: <BusinessIcon />,
    //       path: '/products/categories'
    //     }
    //   ]
    // },
    {
      id: 'point-of-sale',
      label: 'Point of Sale',
      icon: <POSIcon />,
      children: [
        // { id: 'ppob', label: 'PPOB', icon: <ReceiptIcon />, path: '/pos/ppob' },
        {
          id: 'cashier',
          label: 'Cashier',
          icon: <CashierIcon />,
          path: '/transactions/create'
        },
        {
          id: 'transactions',
          label: 'Transactions',
          icon: <TransactionIcon />,
          path: '/transactions/list'
        }
        // {
        //   id: 'consignment',
        //   label: 'Consignment',
        //   icon: <ConsignmentIcon />,
        //   path: '/pos/consignment'
        // },
        // {
        //   id: 'sales-return',
        //   label: 'Sales Return',
        //   icon: <ReturnIcon />,
        //   path: '/pos/sales-return'
        // }
      ]
    }
    // {
    //   id: 'tables',
    //   label: 'Tables',
    //   icon: <TableIcon />,
    //   path: '/tables'
    // }
  ]

  const toggleDrawer = (): void => {
    setOpen(!open)
  }

  const handleMenuClick = (menuId: string, hasChildren: boolean): void => {
    if (!hasChildren) return

    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter((id) => id !== menuId))
    } else {
      setExpandedMenus([...expandedMenus, menuId])
    }
  }

  const handleNavigation = (path?: string): void => {
    if (path) {
      navigate(path)
    }
  }

  const isActive = (path?: string): boolean => {
    if (!path) return false
    return location.pathname === path
  }

  const isMenuExpanded = (menuId: string): boolean => {
    return expandedMenus.includes(menuId)
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          marginTop: '40px',
          paddingBottom: '40px'
        }
      }}
    >
      {/* Header with Logo and Toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          p: 2,
          minHeight: 64
        }}
      >
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {logo && <img src={logo} alt="Logo" style={{ width: 32, height: 32 }} />}
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Samta
            </Typography>
          </Box>
        )}
        <IconButton onClick={toggleDrawer} size="small">
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((menuItem) => {
          const isExpanded = isMenuExpanded(menuItem.id)
          const hasChildren = menuItem.children && menuItem.children.length > 0

          // Header item (separator)
          if (menuItem.isHeader) {
            return open ? (
              <Typography
                key={menuItem.id}
                variant="caption"
                sx={{
                  px: 2,
                  py: 2,
                  mt: 1,
                  display: 'block',
                  color: 'text.secondary',
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  fontSize: '0.7rem'
                }}
              >
                {menuItem.label}
              </Typography>
            ) : (
              <Divider key={menuItem.id} sx={{ my: 2 }} />
            )
          }

          // Menu item without children (direct link)
          if (!hasChildren) {
            return (
              <ListItem key={menuItem.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(menuItem.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    px: 2,
                    bgcolor: isActive(menuItem.path) ? '#C3A86D15' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive(menuItem.path) ? '#C3A86D25' : 'action.hover'
                    },
                    justifyContent: open ? 'initial' : 'center'
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isActive(menuItem.path) ? '#C3A86D' : 'text.secondary'
                    }}
                  >
                    {menuItem.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={menuItem.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: isActive(menuItem.path) ? 600 : 400,
                        color: isActive(menuItem.path) ? '#C3A86D' : 'text.primary'
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            )
          }

          // Menu item with children (expandable)
          return (
            <Box key={menuItem.id}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleMenuClick(menuItem.id, hasChildren)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    px: 2,
                    justifyContent: open ? 'initial' : 'center'
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    {menuItem.icon}
                  </ListItemIcon>
                  {open && (
                    <>
                      <ListItemText
                        primary={menuItem.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'text.primary'
                        }}
                      />
                      {isExpanded ? (
                        <ExpandLess sx={{ fontSize: 20 }} />
                      ) : (
                        <ExpandMore sx={{ fontSize: 20 }} />
                      )}
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              {/* Submenu Items */}
              <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {menuItem.children?.map((child) => (
                    <ListItem key={child.id} disablePadding sx={{ mb: 0.3 }}>
                      <ListItemButton
                        onClick={() => handleNavigation(child.path)}
                        sx={{
                          borderRadius: 2,
                          mx: 1,
                          pl: 6,
                          pr: 2,
                          py: 0.8,
                          bgcolor: isActive(child.path) ? '#C3A86D15' : 'transparent',
                          '&:hover': {
                            bgcolor: isActive(child.path) ? '#C3A86D25' : 'action.hover'
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: isActive(child.path) ? '#C3A86D' : 'text.secondary',
                            mr: 2,
                            flexShrink: 0
                          }}
                        />
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{
                            fontSize: 13,
                            fontWeight: isActive(child.path) ? 600 : 400,
                            color: isActive(child.path) ? '#C3A86D' : 'text.primary'
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          )
        })}
      </List>

      {/* Logout Button (if provided) */}
      {onLogout && (
        <Box sx={{ mt: 'auto', p: 2 }}>
          <ListItemButton
            onClick={onLogout}
            sx={{
              borderRadius: 2,
              bgcolor: '#FFCDD2',
              color: '#B71C1C',
              justifyContent: open ? 'initial' : 'center',
              '&:hover': {
                bgcolor: '#EF9A9A'
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
                color: '#B71C1C'
              }}
            >
              <LogOut />
            </ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Box>
      )}
    </Drawer>
  )
}
