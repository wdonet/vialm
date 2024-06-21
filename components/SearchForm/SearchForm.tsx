import {ActionIcon, Button, Chip, Group, Select, Stack, TextInput} from "@mantine/core";
import {IconArrowDown, IconTrash} from "@tabler/icons-react";
import {ChangeEvent, useState} from "react";

export interface SearchFormProps {
  onFilter: Function
}

interface FilterChip {
  key: string
  value: string
  checked: boolean
}

const DEFAULT_FILTER_OPTIONS = ['name', 'sex', 'diagnosis', 'date', 'status'];

const SearchForm = ({
  onFilter
}: SearchFormProps) => {
  const [filterOptions, setFilterOptions] = useState(DEFAULT_FILTER_OPTIONS);
  const [currentFilterKeyName, setCurrentFilterKeyName] = useState<string | null>(null);
  const [currentFilterValue, setCurrentFilterValue] = useState('');
  const [chips, setChips] = useState<FilterChip[]>([]);

  const handleFilterValue = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setCurrentFilterValue(value)
  }

  const handleFilterKeyName = (value: string | null) => {
    setCurrentFilterKeyName(value)
  }

  const handleAddFilter = () => {
    if (!currentFilterKeyName || !currentFilterValue) {
      return;
    }
    const addedFilter: FilterChip = { key: currentFilterKeyName, value: currentFilterValue, checked: true };
    setChips([ ...chips, addedFilter])
    const theFilterOptions = [ ...filterOptions ];
    const usedFilterIndex = theFilterOptions.findIndex(key => key === addedFilter.key)
    theFilterOptions.splice(usedFilterIndex, 1)
    setFilterOptions(theFilterOptions);
    setCurrentFilterKeyName(null)
    setCurrentFilterValue('')
  }

  const handleCheckStatus = (chip: FilterChip) => {
    const foundIndex = chips.findIndex(({ key }) => key === chip.key);
    const theChips = [...chips];
    theChips[foundIndex].checked = !theChips[foundIndex].checked
    setChips(theChips);
  }

  const handleRemoveChip = (chip: FilterChip) => {
    setFilterOptions([ ...filterOptions, chip.key, ]);
    const theChips = [ ...chips ];
    const foundRemovedChip = theChips.findIndex(({ key }) => key === chip.key);
    theChips.splice(foundRemovedChip, 1);
    setChips(theChips);
  }

  const filters = chips
    .filter(chip => chip.checked)
    .reduce((theFilters: {[key:string]: string}, chip) => {
      theFilters[chip.key] = chip.value;
      return theFilters
    }, {});

  return (
    <Stack justify="flex-start" gap={7} align={"stretch"} styles={{ root: { border: '1px solid #eee', padding: '10px', 'border-radius': '8px' }}} >
      <Group justify="flex-start" gap={7}>
        <Select size="xs" label="Select your filter" withAsterisk data={filterOptions}
                onChange={handleFilterKeyName} value={currentFilterKeyName} />
        <TextInput size="xs" label="Your value" withAsterisk
                   onChange={handleFilterValue} value={currentFilterValue} />
        <ActionIcon variant="outline"
                    styles={{ root: { 'align-self': 'flex-end' }}}
                    onClick={handleAddFilter} disabled={!currentFilterKeyName || !currentFilterValue}>
          <IconArrowDown size='2.3rem' />
        </ActionIcon>
        <Button size="xs"
                styles={{ root: { 'align-self': 'flex-end' }}}
                onClick={() => onFilter(filters)}>Search</Button>
      </Group>
      <Group justify="center" gap={5}>
        { chips.map((chip) => <Chip
          size="xs"
          key={chip.key}
          onClick={() => handleCheckStatus(chip)}
          checked={chip.checked}>
          <ActionIcon variant="white" size="1rem"
                      styles={{ root: { margin: '3px 4px 0 0' }}}
                      onClick={() => handleRemoveChip(chip)}>
            <IconTrash size=".95rem"/>
          </ActionIcon>
          {chip.key}: <strong>{chip.value}</strong>
        </Chip>)}
      </Group>
    </Stack>
  );
}

export default SearchForm;
