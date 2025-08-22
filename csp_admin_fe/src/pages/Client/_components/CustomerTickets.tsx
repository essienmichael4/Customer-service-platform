import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCustomerTickets } from "@/hooks/useCustomerTickets"
import type { Ticket } from "@/lib/types"
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Search } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

interface FilterProps{
    id: number,
}

const emptyData: any[]= []

const CustomerTickets = ({id}:FilterProps) => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [filtering, setFiltering] = useState("")
    const ticketsQuery = useCustomerTickets(id, page, limit)

    const columns:ColumnDef<Ticket>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='No.' />),
        cell:({row}) => <div>
            <Link to={`./${row.original.id}`}>
                <span className='text-gray-400'>#</span>{row.original.id}
            </Link>
        </div>
    },{
        accessorKey: "subject",
        header:({column})=>(<DataTableColumnHeader column={column} title='Subject' />),
        cell:({row}) => <div className="lg:min-w-[250px] text-clamp-1 overflow-ellipsis">
                {row.original.subject}
        </div>
    },{
        accessorKey: "priority",
        header:({column})=>(<DataTableColumnHeader column={column} title='Priority' />),
        cell:({row}) => <div>
            <div className={`${row.original.priority === "LOW" && "bg-emerald-100"} ${row.original.priority === "NORMAL" && "bg-yellow-100"} ${row.original.priority === "HIGH" && "bg-orange-100"} ${row.original.priority === "URGENT" && "bg-rose-100"} rounded-md flex items-center gap-2 text-xs py-2 px-2`}>
                <div className={`${row.original.priority === "LOW" && "bg-emerald-500"} ${row.original.priority === "NORMAL" && "bg-yellow-500"} ${row.original.priority === "HIGH" && "bg-orange-500"} ${row.original.priority === "URGENT" && "bg-rose-500"} h-2 w-2 rounded-full`}></div>
                {row.original.priority}
            </div>
        </div>
    },{
        accessorKey: "type.name",
        header:({column})=>(<DataTableColumnHeader column={column} title='Type' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {row.original.type?.name}
            </div>
        }
    },{
        accessorKey: "createdAt",
        header:({column})=>(<DataTableColumnHeader column={column} title='Request Date' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {new Date(row.original.createdAt as string).toDateString()}
            </div>
        }
    },{
        accessorKey: "ids",
        header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
        cell:({row}) => <div>
            <span className="flex gap-2 items-center"  >
                {/* <EditPackage page={page} limit={limit} search={search} item={row.original} status={status} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
                <DeletePackage trackingNumber={row.original.trackingNumber} id={Number(row.original.id)} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} />  */}
            </span> 
        </div>
    }]

    const table = useReactTable({
        data: ticketsQuery.data?.data || emptyData,
        columns,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        state:{
            pagination: {
                pageIndex: page - 1,
                pageSize: limit,
            }
        },
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: ticketsQuery.data?.meta?.pageCount,
    })

    return (
        <>
            <div className="mt-4 flex justify-between items-center">
                {/* <h3 className="font-bold">Tickets</h3> */}
                <div className="w-full sm:w-[320px]">
                    <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
                    <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
                    <input type="text" placeholder="Plur 890987645368" onChange={e => setFiltering(e.target.value)} className="outline-none text-sm w-full"/>
                    </div>
                </div>
                {/* <div>
                    <button onClick={()=>handleOpenChange()}  className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                        <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Ticket</span>
                    </button>
                </div> */}
            </div>
            {/* <div className="mt-4">
                < page={page} setPage={setPage} setLimit={setLimit} limit={limit}/>
            </div> */}
            <div className="my-4 p-2 md:px-0 border rounded-2xl">
                <div className="w-full rounded-md p-2  bg-white/75">
                    <Table>
                        <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                        )}
                                </TableHead>
                                )
                            })}
                            </TableRow>
                        ))}
                        </TableHeader>
                        <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                <TableCell className='py-6' key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                                ))}
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No tickets added yet
                                <p className="text-sm text-center text-muted-foreground">Try adding one</p>
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between px-4 space-x-2 py-2 mt-4">
                    <div>
                        <span className="mr-2">Items per page</span>
                        <select 
                        className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                        value={limit}
                        onChange={e=> {setLimit(Number(e.target.value))}} >

                        {[10,20,50,100].map((pageSize)=>(
                            <option key={pageSize} value={pageSize}>
                            {pageSize}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                            onClick={()=>setPage(1)}
                            disabled={page === 1}>
                            <ChevronsLeft size={20} />
                        </button>
                        <button
                            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                            onClick={()=>setPage(page - 1)}
                            disabled={page === 1}>
                            <ChevronLeft size={20} />
                        </button>

                        <span className="flex items-center">
                            <input 
                            className="w-16 p-2 rounded-md border border-gray-300 text-center"
                            min={1}
                            max={table.getPageCount()}
                            type="number"
                            value={table.getState().pagination.pageIndex + 1}
                            onChange={e=> {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                setPage(page)
                            }}
                            />
                            <span className="ml-1">of {ticketsQuery.data?.meta.pageCount}</span>
                        </span>

                        <button
                            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                            onClick={()=>setPage(page + 1)}
                            disabled={ page === Number(ticketsQuery.data?.meta.pageCount) }>
                            <ChevronRight size={20} />
                        </button>
                        <button
                            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                            onClick={()=>setPage(Number(ticketsQuery.data?.meta.pageCount))}
                            disabled={page === Number(ticketsQuery.data?.meta.pageCount)}>
                            <ChevronsRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerTickets
