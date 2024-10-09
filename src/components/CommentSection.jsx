import React, { useState, useEffect } from 'react';
import commentService from '../services/commentService';
import azureContentSafetyService from '../services/azureContentSafetyService';
import Alert from './Alert';

export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await commentService.getAll();
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setAlert({ type: 'error', message: 'Error al cargar los comentarios.' });
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async () => {
    if (newComment.trim() !== '') {
      setIsLoading(true);
      try {
        const safetyResult = await azureContentSafetyService.analyzeText(newComment);

        if (!safetyResult.isSafe) {
          const categoriesMessage = safetyResult.unsafeCategories
            .map(cat => `${cat.category} (severidad: ${cat.severity})`)
            .join(', ');

          setAlert({
            type: 'warning',
            message: `Contenido inapropiado detectado en las siguientes categorías: ${categoriesMessage}`
          });
          setIsLoading(false);
          return;
        }

        const createdComment = await commentService.create(newComment);
        setComments(prevComments => [...prevComments, createdComment]);
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
        setAlert({ type: 'error', message: 'Error al añadir el comentario.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startEditing = (id) => {
    setEditingId(id);
    const commentToEdit = comments.find(comment => comment.id === id);
    setNewComment(commentToEdit.text);
  };

  const saveEdit = async () => {
    if (editingId !== null) {
      setIsLoading(true);
      try {
        const trimmedComment = newComment.trim();

        if (trimmedComment === '') {
          // Si el comentario está vacío, lo eliminamos
          await commentService.delete(editingId);
          setComments(prevComments => prevComments.filter(comment => comment.id !== editingId));
          setAlert({ type: 'info', message: 'Comentario eliminado porque estaba vacío.' });
        } else {
          // Si el comentario tiene contenido, procedemos con la verificación y actualización
          const safetyResult = await azureContentSafetyService.analyzeText(trimmedComment);

          if (!safetyResult.isSafe) {
            const categoriesMessage = safetyResult.unsafeCategories
              .map(cat => `${cat.category} (severidad: ${cat.severity})`)
              .join(', ');

            setAlert({
              type: 'warning',
              message: `No se puede guardar la edición. Contenido inapropiado detectado en las siguientes categorías: ${categoriesMessage}`
            });
          } else {
            // Si el contenido es seguro, actualizamos el comentario
            const updatedComment = await commentService.update(editingId, trimmedComment);
            setComments(prevComments => prevComments.map(comment =>
              comment.id === editingId ? updatedComment : comment
            ));
            setAlert({ type: 'success', message: 'Comentario actualizado exitosamente.' });
          }
        }

        // Limpiamos el estado de edición en cualquier caso
        setEditingId(null);
        setNewComment('');
      } catch (error) {
        console.error('Error updating comment:', error);
        setAlert({ type: 'error', message: 'Error al procesar el comentario.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteComment = async (id) => {
    setIsLoading(true);
    try {
      await commentService.delete(id);
      setComments(prevComments => prevComments.filter(comment => comment.id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Comentarios</h2>
      {alert && <Alert type={alert.type} message={alert.message} />}
      <div className="mb-4">
        <textarea
          className="textarea textarea-bordered w-full"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          disabled={isLoading}
        />
        <button
          className="btn btn-primary mt-2"
          onClick={editingId !== null ? saveEdit : addComment}
          disabled={isLoading}
        >
          {editingId !== null ? 'Guardar Edición' : 'Agregar Comentario'}
        </button>
      </div>
      {isLoading && <p>Cargando...</p>}
      <ul className="space-y-4">
        {comments.map(comment => (
          <li key={comment.id} className="bg-base-200 p-4 rounded-lg">
            <p>{comment.text}</p>
            <div className="mt-2">
              <button className="btn btn-sm btn-outline mr-2" onClick={() => startEditing(comment.id)} disabled={isLoading}>Editar</button>
              <button className="btn btn-sm btn-error" onClick={() => deleteComment(comment.id)} disabled={isLoading}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}