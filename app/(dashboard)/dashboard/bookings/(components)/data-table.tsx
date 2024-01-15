"use client"

import {
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  VisibilityState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import qs from "query-string"
import Search from "./search"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
isLastPage:boolean
  page:string
  itemsPerPage:number
  bookingsCount:number


  
}



export function DataTable<TData, TValue>({
  columns,
  data,
  isLastPage,
  page,
  itemsPerPage,
  bookingsCount

}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] =useState<SortingState>([])


    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
      )

      const [columnVisibility, setColumnVisibility] =
      useState<VisibilityState>({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const router = useRouter()
  
const hanldePrevious =()=>{

  const url = qs.stringifyUrl({
    url:`${process.env.NEXT_PUBLIC_MY_URL}/dashboard/bookings`,
    query:{
      page:+page-1
    }
  })

  router.push(url)
}

const handleNext = ()=>{
  const url = qs.stringifyUrl({
    url:`${process.env.NEXT_PUBLIC_MY_URL}/dashboard/bookings`,
    query:{
      page:+page+1
    }
  })

  router.push(url)
}
  return (
    <div>
         <div className="flex items-center py-4">
       <Search />
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    <div className="rounded-md border">
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
                  <TableCell className="font-light text-sm capitalize" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
    <div className="text-xs text-muted-foreground">
        {+page*itemsPerPage < bookingsCount ? +page*itemsPerPage  : bookingsCount}/{bookingsCount}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
      <Button
          variant="outline"
          size="sm"
          onClick={hanldePrevious}
          disabled={+page===1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!!isLastPage}
     
        >
          Next
        </Button>
      </div>
   

    
      </div>
      
    </div>
   
  )
}
