import {
  Group,
  Pagination,
  Table,
  TableTbody as Tbody, TableTd as Td,
  TableTh as Th,
  TableThead as Thead,
  TableTr as Tr,
  Select,
  Stack, Text,
} from '@mantine/core';
import capitalize from 'lodash.capitalize';
import { ComboboxItem } from "@mantine/core/lib/components/Combobox";
import classes from './PaginatedTable.module.css';

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

const pageSizes = ['10', '20', '30', '50', '100']

const PaginatedTable = ({
    data,
    config: { columns, idKey = 'id', },
    pages: { active: activePage, setPage, setPageSize, size: pageSize, totalRows, }
  }: PaginatedTableProps) => {
  const headers: string[] = columns.map(col => col.displayName || capitalize(col.key));
  const keys: string[] = columns.map(col => col.key);
  const rows = data.map(record => (
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
            {headers.map(header => <Th key={header}>{header}</Th>)}
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </Stack>
  );
}

export default PaginatedTable;
