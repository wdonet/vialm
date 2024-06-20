import classes from './Subjects.module.css';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import { useEffect, useState } from 'react';
import { SEX, Subject, SUBJECT_STATUS } from "@/app/lib/definitions";
import { Button, Drawer, Group, SegmentedControl, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isNotEmpty, useForm } from "@mantine/form";
import { DateTimePicker } from '@mantine/dates';
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import dayjs from "dayjs";
import { notifyError, notifySuccess } from "@/app/lib/notify";
import {omit} from "next/dist/shared/lib/router/utils/omit";
import {get} from "@/app/lib/request";

// TODO REMOVE
// const data: Subject[] = [
//   { id: 1, name: 'Ozz', sex: SEX['Male'], diagnosis: 'here diagnosis', date: '2021-09-23 09:23', status: SUBJECT_STATUS['In Screening'] },
//   { id: 2, name: 'Mark', sex: SEX['Male'], diagnosis: 'here diagnosis', date: '2023-10-18 10:56', status: SUBJECT_STATUS['Failed'] },
//   { id: 3, name: 'Peter', sex: SEX['Male'], diagnosis: 'here diagnosis', date: '2020-07-02 23:59', status: SUBJECT_STATUS['Enrolled'] },
//   { id: 4, name: 'Martha', sex: SEX['Female'], diagnosis: 'here diagnosis', date: '2024-01-20 15:55', status: SUBJECT_STATUS['Failed'] },
// ]

const formInitialValues = {
  diagnosis: '',
  date: '',
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
  const [selectedSubject, selectSubject] = useState<Subject>();
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
  }, [active, size]);

  const fetchDataWithParams = () => {
    const skip = calculateSkip(size, active);
    const qryParams = { ...filters, skip, take: size }
    console.log({ qryParams });
    get('/subjects', qryParams)
      .then((results) => {
        setSubjects(results.list)
        setTotalRows(results.totalRows)
      })
  }

  const handleCreate = (values: FormValues) => {
    const added: Partial<Subject> = { ...omit(values, ['date']) };
    added.date = dayjs(values.date).format('YYYY-MM-DD HH:mm');
    // const skip = calculateSkip(size, active);
    // console.log({ filters, skip, take: size });
    Promise.resolve() // TODO API CALL
    // Promise.reject(new Error('this error'))
      .then(() => {
        // TODO refresh table
        setSubjects(subjects);
        notifySuccess('Subject created');
      })
      .catch((e) => {
        notifyError('When saving subject', e);
      })
      .finally(() => {
        form.setValues(formInitialValues);
        close();
      })
  }

  const pages = { active, setPage, setPageSize, size, totalRows}

  return (
    <>
      <div>Search input txt</div>
      <Button onClick={open}>Create</Button>
      <Drawer opened={opened} onClose={close} position="right"
              title={selectedSubject ? `Edit Subject: ${selectedSubject.name}` : 'Create Subject'}>
        <form onSubmit={form.onSubmit(handleCreate)} className={classes.form}>
          <TextInput label="Name" placeholder="Name"
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
          <Group justify="flex-start">
            <Text>Sex</Text>
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
          <DateTimePicker styles={{ root: {'margin-inline': 'unset'}, }}
                          clearable
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
            <Text>Status</Text>
            <SegmentedControl
            key={form.key('status')}
            data={[SUBJECT_STATUS.Enrolled, SUBJECT_STATUS.Failed, SUBJECT_STATUS["In Screening"]]}
            {...form.getInputProps('status')}
            />
          </Group>

          <Group justify="flex-end" mt="xl">
            <Button type="submit" >{selectedSubject ? 'Update' : 'Add'}</Button>
            <Button onClick={close}>Cancel</Button>
          </Group>
        </form>
      </Drawer>
      {/*// @ts-ignore FIXME*/}
      <PaginatedTable data={subjects} config={configTable} pages={pages} />
    </>
  );
}
