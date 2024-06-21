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
import React, {ReactElement, useState} from "react";
import {
  IconAdjustments,
  IconArrowDown,
  IconArrowDownBar,
  IconArrowsUp,
  IconArrowUp, IconEdit,
  IconSort09, IconSortAZ, IconSortZA, IconTrash
} from "@tabler/icons-react";
import {byStringKeyObjectSorter} from "@/app/lib/sorter";

interface ColumnConfig {
  displayName?: string
  key: string
}

interface ActionConfig {
  displayName?: string
  key: string
  icon?: ReactElement
  on: Function
}

export interface PaginatedTableProps {
  data: object[]
  config: {
    columns: ColumnConfig[]
    idKey?: string
  },
  actions?: ActionConfig[]
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

const iconsPerAction: {[key:string]: ReactElement} = {
  edit: <IconEdit size=".95rem"/>,
  delete: <IconTrash size=".95rem"/>,
}

const PaginatedTable = ({
    actions,
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
  const operations = actions?.map(action => {
    const operation = { key: action.key, icon: action.icon, display: action.displayName, on: action.on };
    if(!action.displayName) {
      operation.display = capitalize(action.key);
    }
    if(!action.icon) {
      operation.icon = iconsPerAction[action.key] || <Text size="xs">{operation.display}</Text>
    }
    return operation;
  });
  const rows = sorted.map(record => {
    // @ts-ignore FIXME
    const theId = record[idKey]
    return (
      <Tr key={theId}>
        {/*// @ts-ignore FIXME */}
        {keys.map(key => <Td key={`${theId}${key}`}>{record[key]}</Td>)}
        {operations && <Td><Group gap={3}>
          {operations.map(operation => (
            <ActionIcon key={`${theId}${operation.key}`} size="1.35rem" onClick={() => operation.on(record)}>
              {operation.icon}
            </ActionIcon>
          ))}
        </Group></Td>}
      </Tr>
    )
  });
  return (
    <Stack align="stretch" justify="flex-start" gap="md">
      <Group justify="flex-end">
        <Text size="sm">Rows per page:</Text>
        <Select size="sm" value={pageSize} onChange={setPageSize} data={pageSizes} className={classes.pageSize} />
        <Pagination size="sm" value={activePage} onChange={setPage} total={Math.ceil(totalRows/parseInt(pageSize))} />
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
