'use client';

import { Subjects } from '@/components/Subjects/Subjects';
import Header from "@/components/Header/Header";
import { Container } from "@mantine/core";

export default function HomePage() {
  return (
    <>
      <Header />
      <Container fluid>
        <Subjects />
      </Container>
    </>
  );
}
