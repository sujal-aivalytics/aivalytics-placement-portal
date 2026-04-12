import { NextRequest, NextResponse } from 'next/server';
import { 
  loadLocalData, 
  saveLocalData, 
  appendLocalData, 
  deleteLocalData,
  isLocalhostMode 
} from '@/lib/local-storage';

// GET - Load data from local storage
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params;
    
    if (!isLocalhostMode()) {
      return NextResponse.json(
        { error: 'Local storage only available in development mode' },
        { status: 403 }
      );
    }

    const data = await loadLocalData(collection);
    
    return NextResponse.json({
      collection,
      data: data || [],
      exists: data !== null
    });
  } catch (error: any) {
    console.error('Local data GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load local data', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Save data to local storage (replaces existing)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params;
    const body = await req.json();
    
    if (!isLocalhostMode()) {
      return NextResponse.json(
        { error: 'Local storage only available in development mode' },
        { status: 403 }
      );
    }

    await saveLocalData(collection, body.data);
    
    return NextResponse.json({
      success: true,
      message: `Data saved to local collection: ${collection}`,
      collection
    });
  } catch (error: any) {
    console.error('Local data POST error:', error);
    return NextResponse.json(
      { error: 'Failed to save local data', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Append/Update single item
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params;
    const body = await req.json();
    
    if (!isLocalhostMode()) {
      return NextResponse.json(
        { error: 'Local storage only available in development mode' },
        { status: 403 }
      );
    }

    await appendLocalData(collection, body.item);
    
    return NextResponse.json({
      success: true,
      message: `Item added to local collection: ${collection}`,
      collection
    });
  } catch (error: any) {
    console.error('Local data PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to append local data', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete item or clear collection
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!isLocalhostMode()) {
      return NextResponse.json(
        { error: 'Local storage only available in development mode' },
        { status: 403 }
      );
    }

    if (id) {
      await deleteLocalData(collection, id);
      return NextResponse.json({
        success: true,
        message: `Item ${id} deleted from ${collection}`
      });
    } else {
      // Clear entire collection
      await saveLocalData(collection, []);
      return NextResponse.json({
        success: true,
        message: `Collection ${collection} cleared`
      });
    }
  } catch (error: any) {
    console.error('Local data DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete local data', details: error.message },
      { status: 500 }
    );
  }
}
