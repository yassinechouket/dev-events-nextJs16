import { NextRequest,NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req:NextRequest){
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format'}, { status: 400 })
        }

        const imageField = formData.get('image');

        if(!imageField) {
            return NextResponse.json({ message: 'Image is required'}, { status: 400 });
        }

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);

        // Handle both file upload and URL string
        let imageUrl: string;

        if (typeof imageField === 'string') {
            // If it's a URL string, use it directly
            imageUrl = imageField;
        } else if (imageField instanceof File || imageField instanceof Blob) {
            // If it's a File or Blob, upload to Cloudinary
            const bytes = await imageField.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                    if(error) return reject(error);
                    resolve(results);
                }).end(buffer);
            });

            imageUrl = (uploadResult as { secure_url: string }).secure_url;
        } else {
            return NextResponse.json({ 
                message: 'Invalid image format. Expected File, Blob, or URL string.',
                error: `Received type: ${typeof imageField}`
            }, { status: 400 });
        }

        event.image = imageUrl;

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown'}, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        console.error('Error in GET /api/events:', e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        const errorStack = e instanceof Error ? e.stack : undefined;
        return NextResponse.json({ 
            message: 'Event fetching failed', 
            error: errorMessage,
            stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
        }, { status: 500 });
    }
}


