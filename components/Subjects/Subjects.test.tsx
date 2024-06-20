import { render, screen } from '@/test-utils';
import { Subjects } from './Subjects';

describe('Welcome component', () => {
  it('has correct Next.js theming section link', () => {
    render(<Subjects />);
    expect(screen.getByText('this guide')).toHaveAttribute(
      'href',
      'https://mantine.dev/guides/next/'
    );
  });
});
