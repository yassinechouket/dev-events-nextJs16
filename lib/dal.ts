import { db } from '@/database'
import { getSession } from './auth'
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { users } from '@/database/schema'
import { mockDelay } from './utils'
import { unstable_cacheTag as cacheTag } from 'next/cache'


export const getUserByEmail = cache(async (email: string) => {
    try{
        const result=await db.select().from(users).where(eq(users.email, email)).limit(1)
        return result[0] || null
    } catch (error) {
        console.error('Error fetching user by email:', error)
        return null
    }
    
})