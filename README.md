# memory-game-admin

## BUGS

### Bug-Fix-1
In quizres.js editItem(item) JSON.stringify(item) seems to malfunction. 
Fix: Instead of passing the item, I pass the id of the quiz dataset, which is stored in apiController.quizes array. 
And then extract the item from apiController.quizes inside editItem(quiz_id)

### Bug-Fix-2
In editItem(quiz_id) add a hidden span field with id="edit_category". The reason for that is that updateItem(quiz_id) reads the category-id from that field. The reason for that is that the user can change that field when editting the quiz.
I have also removed the renderQuiz() reference it editItem(quiz_id), because the function does not exist anymore.