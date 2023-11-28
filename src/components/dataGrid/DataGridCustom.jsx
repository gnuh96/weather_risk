import './styles.css'
import {DataGrid} from '@mui/x-data-grid'

import {styled} from '@mui/material/styles'

const StyledDataGrid = styled(DataGrid)(() => ({
  '& .MuiDataGrid-columnHeaders': {
    borderBottom: '1px solid #7A8295',
    width: '100%',
  },

  '& .MuiDataGrid-columnHeader': {
    paddingRight: '0px',
  },
  '& .MuiDataGrid-columnHeaderTitleContainer': {
    justifyContent: 'center',
  },

  '& .MuiDataGrid-columnHeaderTitleContainerContent': {
    width: '100%',
    justifyContent: 'center',
    textTransform: 'capitalize',
  },

  '& .MuiDataGrid-iconButtonContainer button': {
    padding: '4px',
  },
  '& .MuiDataGrid-cell': {
    justifyContent: 'center',
  },
}))

export default function DataGridCustom({
  rows,
  cols,
  maxHeight,
  rowHeight,
  noRowText = 'No rows',
  onRowClick,
}) {
  const customLocaleText = {
    noRowsLabel: noRowText,
  }

  return (
    <div
      className='dataGridContainer'
      style={{maxHeight: maxHeight, width: '95%'}}>
      <StyledDataGrid
        disableColumnFilter
        rows={rows}
        columns={cols}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        disableColumnMenu
        rowHeight={rowHeight}
        localeText={customLocaleText}
        onRowClick={onRowClick}
      />
    </div>
  )
}
