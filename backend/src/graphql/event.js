export const deleteAcknowledgementSchema = `#graphql
    type Event {
       postId: ID!
       session: ID!
       action: String
       Date: String
    }
`
