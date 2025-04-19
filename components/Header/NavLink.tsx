import { Link } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import type { LinkProps } from 'expo-router';

type NavLinkProps = {
  label: string;
  route: LinkProps['href']; // <-- this is key!
};

export default function NavLink({ label, route }: NavLinkProps) {
  return (
    <Link href={route} asChild>
      <TouchableOpacity>
        <Text className="text-gray-700 text-sm hover:text-blue-600">{label}</Text>
      </TouchableOpacity>
    </Link>
  );
}
