import {supabase} from '../../api/supabase-client'
import { NextRequest, NextResponse } from "next/server";


export default function AuthHandler(req:NextRequest, res:NextResponse) {
    supabase.auth.api.setAuthCookie(req, res)
}