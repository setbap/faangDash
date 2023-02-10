import {
  Box,
  Button,
  FormControl,
  Input,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Table as ChTable,
  TableContainer,
  Tbody,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  FormLabel,
  Select,
  ButtonGroup,
  IconButton,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  HStack,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";
import FocusLock from "react-focus-lock";

import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import React, {
  HTMLInputTypeAttribute,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  ColumnDef,
  flexRender,
  SortingState,
  SortDirection,
  Column,
  Table,
  PaginationState,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { AiFillSetting, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { BiFirstPage, BiLastPage } from "react-icons/bi";

export interface IShowTableProps<T> {
  data: T[];
  columnsDef: ColumnDef<T>[];
  customHeaderColor: string;
  tablePageSize?: number;
  onRowClick?: ((id: T) => void) | null;
}
export const ShowTable = React.memo(function TableComponent<T>({
  data,
  columnsDef,
  customHeaderColor,
  tablePageSize = 10,
  onRowClick = null,
}: IShowTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: tablePageSize,
  });

  const columns = useMemo<ColumnDef<T>[]>(() => columnsDef, []);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      pagination,
    },
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });
  return (
    <>
      <TableContainer ml={'0'} width={{ "base": 'calc(100vw - 80px)', md: 'calc(100vw - 132px)' }} pt={"2"} pb="4" >
        <ChTable variant="simple">
          <Thead
            borderTopRadius={"sm"}
            overflow="hidden"
            color={"black"}
            bg={`${customHeaderColor}20`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr h={"4"} color="black" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    <Box
                      display="inline-block"
                      cursor={
                        header.column.getCanSort() ? "pointer" : "default"
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      <small>
                        {" "}
                        {!!header.column.getFilterValue() &&
                          `(${header.column.getFilterValue()})`}
                      </small>
                      <Box display="inline-block">
                        <SortStateIcon data={header.column.getIsSorted()} />
                      </Box>
                    </Box>
                    {header.column.getCanFilter() ? (
                      <Box ml={2} display="inline-block">
                        <Filter column={header.column} table={table} />
                      </Box>
                    ) : null}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr
                onClick={() => {
                  if (!onRowClick) {
                    return;
                  }
                  return onRowClick(row.original as T);
                }}
                height="40px"
                _hover={{ bg: useColorModeValue("#eee", "#282828") }}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <Td border={"none"} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <Tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Tfoot>
        </ChTable>
      </TableContainer>

      <HStack
        data-html2canvas-ignore
        flexDir={{ 'base': 'column', md: 'row' }}
        gap={'4'}
        mt="4"
        justifyContent={"start"}
        spacing={4}
      >
        <InputGroup w={"160px"} rounded={"lg"} overflow="hidden" size="sm">
          <InputLeftAddon children="page" />
          <Input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />

          <InputRightAddon children={`of ${table.getPageCount()}`} />
        </InputGroup>
        <ButtonGroup w={"160px"} size="sm" isAttached variant="outline">
          <IconButton
            aria-label="go to first page"
            icon={<BiFirstPage />}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          />
          <IconButton
            aria-label="previous page"
            icon={<AiOutlineLeft />}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
          <IconButton
            aria-label="next page"
            icon={<AiOutlineRight />}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />

          <IconButton
            aria-label="go to last page"
            icon={<BiLastPage />}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          />
        </ButtonGroup>
        <Select
          w={"160px"}
          size="sm"
          rounded={"lg"}
          value={table.getState().pagination.pageSize}
          p="0.5"
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </Select>
      </HStack>
    </>
  );
});

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const SortStateIcon = ({ data }: { data: false | SortDirection }) => {
  return (
    <Box w={"2"}>
      {data === "desc" && <TiArrowSortedDown />}
      {data === "asc" && <TiArrowSortedUp />}
    </Box>
  );
};

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  type,
  label,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  label: string;
  type: HTMLInputTypeAttribute;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <FormControl data-html2canvas-ignore>
      <FormLabel htmlFor={label}>{label}</FormLabel>
      <Input
        type={type}
        {...(props as any)}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </FormControl>
  );
}

const FilterContainer = ({ children }: { children: JSX.Element }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);

  return (
    <>
      <Popover
        data-html2canvas-ignore
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement="auto"
        closeOnBlur={false}
        closeOnEsc
      >
        <PopoverTrigger>
          <IconButton
            data-html2canvas-ignore
            aria-label="open filter column"
            size="sm"
            variant={"ghost"}
            icon={<AiFillSetting />}
          />
        </PopoverTrigger>
        <PopoverContent
          data-html2canvas-ignore
          bg={useColorModeValue("white", "#232323")}
          p={3}
        >
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverCloseButton p={2} />
            <Stack data-html2canvas-ignore mt={2} spacing={3}>
              {children}
              <Button onClick={onClose}>Close</Button>
            </Stack>
          </FocusLock>
        </PopoverContent>
      </Popover>
    </>
  );
};

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === "number" ? (
    <FilterContainer>
      <Box>
        <Stack spacing={4}>
          <DebouncedInput
            label={`${column.id as string} (min)`}
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
            value={(columnFilterValue as [number, number])?.[0] ?? ""}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                value,
                old?.[1],
              ])
            }
            placeholder={`Min ${column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
              }`}
          />
          <DebouncedInput
            label={`${column.id as string} (max)`}
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                value,
              ])
            }
            placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
              }`}
          />
        </Stack>
      </Box>
    </FilterContainer>
  ) : (
    <FilterContainer>
      <>
        <datalist id={column.id + "list"}>
          {sortedUniqueValues.slice(0, 5000).map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist>
        <DebouncedInput
          label={column.id as string}
          type="text"
          value={(columnFilterValue ?? "") as string}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          className="w-36 border shadow rounded"
          list={column.id + "list"}
        />
      </>
    </FilterContainer>
  );
}
