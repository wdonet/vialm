import {
  Group,
  Pagination,
  Table,
  TableTbody as Tbody, TableTd as Td,
  TableTh as Th,
  TableThead as Thead,
  TableTr as Tr,
  Select,
  Stack, Text, ActionIcon,
} from '@mantine/core';
import capitalize from 'lodash.capitalize';
import { ComboboxItem } from "@mantine/core/lib/components/Combobox";
import classes from './PaginatedTable.module.css';
import React, {useState} from "react";
import {
  IconAdjustments,
  IconArrowDown,
  IconArrowDownBar,
  IconArrowsUp,
  IconArrowUp,
  IconSort09, IconSortAZ, IconSortZA
} from "@tabler/icons-react";
import {byStringKeyObjectSorter} from "@/app/lib/sorter";

interface ColumnConfig {
  displayName?: string
  key: string
}

export interface PaginatedTableProps {
  data: object[]
  config: {
    columns: ColumnConfig[]
    idKey?: string
  },
  pages: {
    active: number,
    setPage: (value: number) => void,
    setPageSize: (value: string | null, option: ComboboxItem) => void;
    size: string,
    totalRows: number,
  }
}

interface Header {
  display: string,
  key: string,
}

const pageSizes = ['10', '20', '30', '50', '100']

const PaginatedTable = ({
    data,
    config: { columns, idKey = 'id', },
    pages: { active: activePage, setPage, setPageSize, size: pageSize, totalRows, }
  }: PaginatedTableProps) => {
  const [isAscendingSort, setIsAscendingSort] = useState(true);
  const [fieldSort, setFieldSort] = useState('')

  const sortBy = (key: string) => {
    // always start with ascending sorting
    setIsAscendingSort(key !== fieldSort ? true : !isAscendingSort);
    setFieldSort(key);
  }

  let sorted = [ ...data ];
  if (fieldSort) {
    sorted.sort(
      byStringKeyObjectSorter(
        { isAscending: isAscendingSort, keyName: fieldSort }
      ));
  }

  const IconSort = isAscendingSort ? IconSortAZ : IconSortZA
  const headers: Header[] = columns.map(col => ({ display: col.displayName || capitalize(col.key), key: col.key }));
  const keys: string[] = columns.map(col => col.key);
  const rows = sorted.map(record => (
    // @ts-ignore FIXME
    <Tr key={record[idKey]}>
      {/*// @ts-ignore FIXME */}
      {keys.map(key => <Td key={`${record[idKey]}${key}`}>{record[key]}</Td>)}
    </Tr>
  ));
  return (
    <Stack align="stretch" justify="flex-start" gap="md">
      <Group justify="flex-end">
        <Text>Rows per page:</Text>
        <Select value={pageSize} onChange={setPageSize} data={pageSizes} className={classes.pageSize}/>
        <Pagination value={activePage} onChange={setPage} total={Math.ceil(totalRows/parseInt(pageSize))} />
      </Group>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Thead>
          <Tr>
            { headers.map(header => <Th key={header.key} >
              <Group justify="flex-start" gap={5}>
                <ActionIcon size="1.25rem"
                            variant={header.key === fieldSort ? 'filled' : 'outline'}
                            onClick={() => sortBy(header.key)}>

                  { header.key === fieldSort
                    ? <IconSort size="1rem"/>
                    : <IconSortAZ size="1rem"/>
                  }
                </ActionIcon>
                {header.display}
              </Group>
            </Th>)}
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </Stack>
  );
}

export default PaginatedTable;
