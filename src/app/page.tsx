import { Hero } from '@/components/ui/hero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat - QwkSearch',
  description: 'Chat with the internet, chat with QwkSearch.',
};

const Home = () => {
  return <Hero />;
};

export default Home;
