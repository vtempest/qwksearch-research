import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Docs - QwkSearch',
  description: 'Documentation for QwkSearch AI Research Assistant',
};

export default function DocsPage() {
  return (
    <div className="h-full w-full">
      <iframe
        src="https://airesearch.js.org"
        className="w-full h-full border-0"
        title="QwkSearch Documentation"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}
