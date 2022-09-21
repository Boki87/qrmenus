
export type GoogleProfile = {
    app_metadata?: {
        provider?: string
    },
    identities:{
        identity_data: {
            avatar_url:string,
            full_name:string
        }
    }[]
}
