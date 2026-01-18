import React from 'react'
import { Box, Paper, Typography, TextField, Button, InputAdornment } from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Add as AddIcon
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { UseIndex } from './hook/useIndex'

export const ListTransactionPage: React.FC = () => {
  const {
    dataTransactions,
    loading,
    setSearchQuery,
    paginationModel,
    setPaginationModel,
    handleDownload,
    handleAddNew,
    searchQuery,
    columns
  } = UseIndex()

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderRadius: 3,
        padding: 3,
        height: 'calc(100vh - 120px)'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Transactions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              borderColor: 'grey.300',
              color: 'text.primary',
              textTransform: 'none',
              '&:hover': {
                borderColor: 'grey.400',
                bgcolor: 'grey.50'
              }
            }}
          >
            Download
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{
              bgcolor: '#C3A86D',
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#b0a080'
              }
            }}
          >
            Add new
          </Button>
        </Box>
      </Box>

      {/* Search and Filter */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3
        }}
      >
        <TextField
          fullWidth
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            )
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              bgcolor: '#F0F0F0',
              '& fieldset': {
                borderColor: 'transparent'
              },
              '&:hover fieldset': {
                borderColor: '#c4b896'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#c4b896'
              }
            }
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{
            minWidth: 120,
            height: '55px',
            borderRadius: '16px',
            borderColor: 'grey.300',
            color: 'text.primary',
            textTransform: 'none',
            '&:hover': {
              borderColor: 'grey.400',
              bgcolor: 'grey.50'
            }
          }}
        >
          Filter
        </Button>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 'calc(100% - 140px)', width: '100%' }}>
        {dataTransactions && (
          <DataGrid
            rows={dataTransactions}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            loading={loading.fetchTransactions}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'grey.100',
                alignItems: 'center',
                display: 'flex',
                verticalAlign: 'middle',
                minHeight: '52px'
              },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'grey.50',
                borderBottom: '1px solid',
                borderColor: 'grey.200',
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%'
                }
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  bgcolor: 'grey.50'
                },
                alignItems: 'center',
                minHeight: '52px'
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid',
                borderColor: 'grey.200'
              }
            }}
          />
        )}
      </Box>
    </Paper>
  )
}
