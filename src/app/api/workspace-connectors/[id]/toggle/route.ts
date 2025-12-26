import configManager from '@/lib/config';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: 'Connector ID is required' },
        { status: 400 }
      );
    }

    const connector = configManager.toggleWorkspaceConnector(id);

    return NextResponse.json(connector);
  } catch (err) {
    console.error('Error toggling workspace connector:', err);
    return NextResponse.json(
      { message: 'An error has occurred.' },
      { status: 500 }
    );
  }
};
