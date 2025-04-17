import React, { useState } from 'react';
import { Chip, Box, TextField } from '@mui/material';

const TagsManager = ({ tags, onAddTag, onRemoveTag }) => {
   const [newTag, setNewTag] = useState('');

   const handleAddTag = () => {
       if (newTag.trim()) {
           onAddTag(newTag.trim());
           setNewTag('');
       }
   };

   return (
       <Box>
           <TextField
               value={newTag}
               onChange={(e) => setNewTag(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
               placeholder="Add tag"
               size="small"
           />
           <Box sx={{ mt: 1 }}>
               {tags.map(tag => (
                   <Chip
                       key={tag}
                       label={tag}
                       onDelete={() => onRemoveTag(tag)}
                       sx={{ m: 0.5 }}
                   />
               ))}
           </Box>
       </Box>
   );
};

export default TagsManager;