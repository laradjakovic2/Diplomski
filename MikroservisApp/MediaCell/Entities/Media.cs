using MediaCell.Enums;

namespace MediaCell.Entities
{
    public class Media
    {
        public int Id { get; set; }
        public int RelatedEntityId { get; set; }
        public EntityType EntityType { get;set; }
        public MediaType MediaType { get; set; }
        public required string Url { get;set; }
        public DateTime CreatedAt { get;set; }

    }
}
