
export const moveTask = (source, destination, taskId, boardColumns) => {
    const updatedColumns = JSON.parse(JSON.stringify(boardColumns));
    
    // Trouver la colonne source et destination
    const sourceColumn = updatedColumns.find(col => col.id === source.droppableId);
    const destColumn = updatedColumns.find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return boardColumns;
    
    // Retirer la tâche de la colonne source
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
    
    // Ajouter la tâche à la colonne de destination
    destColumn.tasks.splice(destination.index, 0, movedTask);
    
    return updatedColumns;
  };
  
  export const reorderTasks = (columnId, startIndex, endIndex, boardColumns) => {
    const updatedColumns = JSON.parse(JSON.stringify(boardColumns));
    const column = updatedColumns.find(col => col.id === columnId);
    
    if (!column) return boardColumns;
    
    // Réorganiser les tâches dans la même colonne
    const [movedTask] = column.tasks.splice(startIndex, 1);
    column.tasks.splice(endIndex, 0, movedTask);
    
    return updatedColumns;
  };