'use client';
import { useState } from "react";
import { createBooking } from "@/lib/action/booking.actions";



export function Input(props: React.ComponentPropsWithoutRef<'input'>){
    return <input {...props}/>;
}
export function Button(props: React.ComponentPropsWithoutRef<'button'>){
    return <button {...props}/>;
}
type FormProps = React.ComponentPropsWithoutRef<'form'>;
const Form=(props: FormProps)=>{
    const [email, setEmail] = useState('');
    return(
    <form {...props}>
        <div>
            <label htmlFor="email">Email Address</label>
            <Input
                type="email"
                color="white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Enter your email address"
            />
        </div>

        <Button type="submit" className="button-submit">Submit</Button>
    </form>);
}

export default function BookEvent({eventId,slug}: {eventId: string; slug: string}) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted]=useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await createBooking({ eventId, slug, email });
        const { success, error } = result;
        if (success) {
            setSubmitted(true);
        } else {
            console.error('Booking creation failed', error);
        }
    };

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <Form onSubmit={handleSubmit} />
            )}
        </div>
    )
    
    }

