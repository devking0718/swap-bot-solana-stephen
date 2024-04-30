import React from "react";
import DataTable, { TableColumn } from "react-data-table-component"
import { TransactionListItemProps } from "../pages/HomePage";

export const WalletTable = () => {

    type DataRow = {
        no: number,
        address: string
    }
    const columns: TableColumn<DataRow>[] = [
        {
            name: 'No',
            selector: row => row.no
        },
        {
            name: 'Address',
            selector: row => row.address
        },
    ];

    const data = [
        {
            no: 1,
            address: 'HfpM...PASq'
        },
        {
            no: 2,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 3,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 4,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 5,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 6,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 7,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 8,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 9,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 10,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 11,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 12,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
        {
            no: 13,
            address: 'HfpMt47kLLLv1euzL9ujCk4QdTkUwFZuRVAtbaYCPASq'
        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '32px',
                background: '#131C2B',
                color: 'white',
                border: '1px solid #495057'
            }
        },
        headRow: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                background: '#0D1521',
                color: 'white',
                border: '1px solid #495057',
                fontSize: '16px'
            },
        },
        pagination: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                background: '#131C2B',
                color: 'white',
                border: '1px solid #495057',
            },
            pageButtonsStyle: {
                borderRadius: '50%',
                height: '30px',
                width: '30px',
                padding: '3px',
                margin: '2px',
                cursor: 'pointer',
                transition: '0.4s',
                color: 'white',
                filter: 'invert(1)'
            },
        }
    };

    const paginationRowsPerPageOptions = {
        rowsPerPageText: '',
        rangeSeparatorText: 'de',
        selectAllRowsItem: false,
        selectAllRowsItemText: 'Todos',
        noRowsPerPage: true,
    }

    return (
        <div className="WalletTable">
            <DataTable
                columns={columns}
                data={data}
                pagination
                customStyles={customStyles}
                paginationPerPage={5}
                paginationComponentOptions={paginationRowsPerPageOptions}
            />
        </div>
    )
}

interface DataProps {
    data: TransactionListItemProps[]
}


export const TransactionTable: React.FC<DataProps> = (data) => {

    const columns: TableColumn<TransactionListItemProps>[] = [
        {
            name: 'No',
            selector: (row, index) => (index ?? -1) + 1
        },
        {
            name: 'Hash',
            cell: row => <a href={`https://solscan.io/tx/${row.hash}`} target="_blank" className="text-white">{(row.hash).slice(0, 3) + "..." + (row.hash).slice(-3)}</a>
        },
        {
            name: 'SOL',
            selector: row => row.sol
        },
        {
            name: 'Token',
            selector: row => row.token
        },
        {
            name: 'Action',
            selector: row => row.action
        },
        {
            name: 'Status',
            cell: row => row.status === true ? <span>🟢</span> : <span>🔴</span>
        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '32px',
                background: '#131C2B',
                color: 'white',
                border: '1px solid #495057'
            }
        },
        headRow: {
            style: {
                background: '#0D1521',
                color: 'white',
                border: '1px solid #495057',
                fontSize: '16px'
            },
        },
        pagination: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                background: '#131C2B',
                color: 'white',
                border: '1px solid #495057',
            },
            pageButtonsStyle: {
                borderRadius: '50%',
                height: '30px',
                width: '30px',
                padding: '3px',
                margin: '2px',
                cursor: 'pointer',
                transition: '0.4s',
                color: 'white',
                filter: 'invert(1)'
            },
        },
        cells: {
            style: {
                width: '100%',
            },
        },
    };

    return (
        <div className="TransactionTable">
            <DataTable
                columns={columns}
                data={data.data}
                pagination
                customStyles={customStyles}
            />
        </div>
    )
}