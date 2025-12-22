import ChatWindow from '@/components/ChatWindow';
import { Metadata } from 'next';
import { getBackgroundArtwork } from '@/lib/home/home-extras';

export const metadata: Metadata = {
  title: 'Chat - QwkSearch',
  description: 'Chat with the internet, chat with QwkSearch.',
};

const Home = () => {
  const background = getBackgroundArtwork();
  return <ChatWindow background={background} />;
};

export default Home;
