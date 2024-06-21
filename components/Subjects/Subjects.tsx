import classes from './Subjects.module.css';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import { useEffect, useState } from 'react';
import { SEX, Subject, SUBJECT_STATUS } from "@/app/lib/definitions";
import {Button, Drawer, Group, SegmentedControl, Stack, Text, TextInput} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isNotEmpty, useForm } from "@mantine/form";
import { DateTimePicker } from '@mantine/dates';
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import dayjs from "dayjs";
import { notifyError, notifySuccess } from "@/app/lib/notify";
import {omit} from "next/dist/shared/lib/router/utils/omit";
import {get, post, put, remove} from "@/app/lib/request";
import SearchForm from "@/components/SearchForm/SearchForm";

const formInitialValues = {
  date: '',
  diagnosis: '',
  name: '',
  sex: SEX.Male,
  status: SUBJECT_STATUS.Enrolled,
}

const configTable = {
  columns: [
    { key: 'name' },
    { key: 'sex' },
    { key: 'diagnosis' },
    { key: 'date' },
    { key: 'status' },
  ]
}

const calculateSkip = (pageSize:string, activePage:number) => parseInt(pageSize) * (activePage - 1)

export const Subjects = () => {
  const [active, setPage] = useState(1);
  const [size, setPageSize] = useState('20');
  const [totalRows, setTotalRows] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSubject, selectSubject] = useState<Subject | undefined>();
  const [filters, setFilters] = useState<Subject>({} as Subject);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: formInitialValues,
    validate: {
      name: isNotEmpty('Name is mandatory')
    }
  });
  type FormValues = typeof form.values;

  useEffect(() => {
    fetchDataWithParams();
  }, [filters, active, size]);

  const fetchDataWithParams = () => {
    const skip = calculateSkip(size, active);
    const qryParams = { ...filters, skip, take: size }
    get('/subjects', qryParams)
      .then(results => {
        setSubjects(results.list)
        setTotalRows(results.totalRows)
      })
      .catch((error) => {
        notifyError('When fetching data', error)
      })
  }

  const handleFilter = (filters: Subject) => {
    setFilters(filters)
  }

  const handleDelete = (record: {[key:string]:any}) => {
    remove(`/subjects/${record.id}`)
      .then(fetchDataWithParams)
      .then(() => {
        notifySuccess(`Subject deleted: ${record.name}`)
      })
      .catch((error) => {
        notifyError(`When deleting: ${record.name}`, error)
      })
  }

  const handleSave = (values: FormValues) => {
    const subject: Partial<Subject> = { ...omit(values, ['date']) };
    subject.date = dayjs(values.date).format('YYYY-MM-DD HH:mm');
    const updateFn = selectedSubject ? put : post;
    const id = selectedSubject ? '/' + subject.id : '';
    updateFn(`/subjects${id}`, subject)
      .then(fetchDataWithParams)
      .then(() => {
        notifySuccess(`Subject saved: ${subject.name}`);
      })
      .catch((e) => {
        notifyError('When saving subject', e);
      })
      .finally(() => {
        form.setValues(formInitialValues);
        close();
      })
  }

  const handleOpenEdition = (record: Subject) => {
    selectSubject(record);
    form.setValues(omit(record, ['date']));
    // @ts-ignore
    form.setFieldValue('date', dayjs(record.date));
    open();
  }

  const handleCancelEdition = () => {
    selectSubject(undefined)
    close()
  }

  const pages = { active, setPage, setPageSize, size, totalRows}
  const actions = [ { key: 'edit', on: handleOpenEdition }, { key: 'delete', on: handleDelete }, ]
  return (
    <Stack justify="flex-start" gap={12}>
      <SearchForm onFilter={handleFilter} />
      <Group justify="flex-end">
        <Button size="xs" onClick={open}>Create</Button>
      </Group>
      <Drawer opened={opened} onClose={close} position="right"
              title={selectedSubject ? `Edit Subject: ${selectedSubject.name}` : 'Create Subject'}>
        <form onSubmit={form.onSubmit(handleSave)} className={classes.form}>
          <TextInput label="Name" placeholder="Name"
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
          <Group justify="flex-start">
            <Text size="sm">Sex</Text>
            <SegmentedControl
              key={form.key('sex')}
              data={[SEX.Male, SEX.Female]}
              {...form.getInputProps('sex')}
            />
          </Group>
          <TextInput label="Diagnosis" placeholder="Diagnosis" size="sm"
            key={form.key('diagnosis')}
            {...form.getInputProps('diagnosis')}
          />
          <DateTimePicker clearable
                          label="Date"
                          placeholder="Pick date and time"
                          nextIcon={<IconArrowRight />}
                          previousIcon={<IconArrowLeft />}
                          mx="auto"
                          valueFormat="YYYY-MM-DD HH:mm"
                          key={form.key('date')}
                          {...form.getInputProps('date')}
          />
          <Group justify="flex-start">
            <Text size="sm">Status</Text>
            <SegmentedControl
            key={form.key('status')}
            data={[SUBJECT_STATUS.Enrolled, SUBJECT_STATUS.Failed, SUBJECT_STATUS["In Screening"]]}
            {...form.getInputProps('status')}
            />
          </Group>

          <Group justify="flex-end" mt="xl">
            <Button type="submit" >{selectedSubject ? 'Update' : 'Add'}</Button>
            <Button onClick={handleCancelEdition}>Cancel</Button>
          </Group>
        </form>
      </Drawer>
      {/*// @ts-ignore FIXME*/}
      <PaginatedTable data={subjects} config={configTable} pages={pages} actions={actions} />
    </Stack>
  );
}
