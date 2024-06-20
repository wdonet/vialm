import { Group } from '@mantine/core';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import classes from './Header.module.css';

const Header = () => (
    <Group justify="flex-end" className={classes.header}>
      <ColorSchemeToggle />
    </Group>
)

export default Header;
