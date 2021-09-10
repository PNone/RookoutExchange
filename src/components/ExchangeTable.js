import React from 'react';
import { useTable } from 'react-table';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function ExchangeTable({ deletePair, data }) {

    const columns = [
        {
            Header: 'First Coin',
            accessor: 'firstCoin',
        },
        {
            Header: 'Second Coin',
            accessor: 'secondCoin',
        },
        {
            Header: 'Rate',
            accessor: 'ask',
        },
        {
            Header: 'Delete',
            accessor: 'delete',
            Cell: (row) => (
                <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    onClick={deletePair(row.index)}>
                    Delete
                </span>
            )
        },
    ];

    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data
    });

    // Render the UI for your table
    return (
        <MaUTable {...getTableProps()}>
            <TableHead>
                {headerGroups.map(headerGroup => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <TableCell {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>
            <TableBody>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <TableRow {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <TableCell {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    )
                })}
            </TableBody>
        </MaUTable>
    )

}

export default ExchangeTable;