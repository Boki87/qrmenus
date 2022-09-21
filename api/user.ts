import {supabase} from './supabase-client'
import {User} from '../types/User'
import {Profile} from '../types/Profile'
import { UserProfile } from '../types/UserProfile'
import {GoogleProfile} from '../types/GoogleProfile'

async function signupUser(name: string, email: string, password: string):Promise<UserProfile | undefined> {
    let {user, session, error} = await supabase.auth.signUp({email, password})
    if(error || !user) {
        throw new Error('error registering...')
        return
    } 

    //insert row in profiles table
    let {data: profileData, error: profileError}  = await supabase.from<Profile>('profiles').insert([{
        user_id: user?.id,
        name
       }])

      if(!profileData || profileError)  {
        throw new Error('Error registering...')
        return
      }

     return {
        id: user.id,
        user_profile_id:profileData[0].id,
        name:profileData[0].name,
        email:user.email,
        avatar:profileData[0].avatar,
        created_at:profileData[0].created_at,
     } 
}


async function getUserProfileFromSession(user: User): Promise<UserProfile | undefined> {
    

    let {data, error: profileError}  = await supabase.from<Profile>('profiles').select("*")

    if(!data || profileError) {
      throw new Error('' + profileError)
      return
    }


    return {
      id: user?.id,
      user_profile_id: data[0]?.id,
      email: user?.email,
      name: data[0]?.name,
      avatar: data[0]?.avatar,
      created_at: data[0]?.created_at ,
    } 
}


async function signinUser(email:string, password:string) {
    let {user, error, session} = await supabase.auth.signIn({email, password})
    if(!user || error) {
        throw new Error(error?.message)
    }

    let userProfile = await getUserProfileFromSession(user)

    return userProfile
}



async function createUserProfileFromGoogle(user: User & GoogleProfile) {

    let fullName = ''
    if(user?.app_metadata?.provider === 'google') {
        fullName = user.identities[0].identity_data.full_name
    }

    //check if data exists inside profiles table
    let {data: profileExistsCheck, error} = await supabase.from('profiles').select('*').eq('user_id', user.id)
    if(error || !profileExistsCheck || profileExistsCheck.length == 0) {
        //create user profile 
        let {data: newProfileData, error: newProfileError} = await supabase.from('profiles').insert([{
            user_id: user.id,
            name: fullName
        }])

        if(!newProfileData || error) {
            throw new Error(error?.message)
        }

        return {
            id: user?.id,
            user_profile_id: newProfileData[0].id,
            email: user?.email,
            name: newProfileData[0]?.name || '',
            avatar: newProfileData[0]?.avatar || '',
            created_at: newProfileData[0]?.created_at ,
        } 
    }else {
        
        return {
            id: user?.id,
            user_profile_id: profileExistsCheck[0]?.id,
            email: user?.email,
            name: profileExistsCheck[0]?.name || '',
            avatar: profileExistsCheck[0]?.avatar || '',
            created_at: profileExistsCheck[0]?.created_at ,
        } 
    }


}



export {
    signupUser,
    getUserProfileFromSession,
    createUserProfileFromGoogle,
    signinUser,
}
