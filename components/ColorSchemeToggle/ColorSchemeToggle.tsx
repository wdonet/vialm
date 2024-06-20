'use client';

import { ActionIcon, Button, Group, useMantineColorScheme, ThemeIcon } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';


export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isLightTheme = colorScheme === 'light';

  return (
    <ActionIcon onClick={() => setColorScheme(isLightTheme? 'dark' : 'light')}
                variant="outline" color="gray" >
      {isLightTheme ? <IconMoon/> : <IconSun />}
    </ActionIcon>
  );
}
