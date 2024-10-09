// src/services/commentService.js
class CommentService {
  constructor() {
    this.comments = [];
    this.nextId = 1;
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.comments]); // Devolvemos una copia para evitar mutaciones directas
      }, 100);
    });
  }

  async create(text) {
    const newComment = {
      id: this.nextId++,
      text: text,
      createdAt: new Date().toISOString()
    };
    this.comments.push(newComment);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...newComment }); // Devolvemos una copia para evitar mutaciones directas
      }, 100);
    });
  }

  async update(id, text) {
    const commentIndex = this.comments.findIndex(comment => comment.id === id);
    if (commentIndex > -1) {
      this.comments[commentIndex] = {
        ...this.comments[commentIndex],
        text: text,
        updatedAt: new Date().toISOString()
      };
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...this.comments[commentIndex] }); // Devolvemos una copia para evitar mutaciones directas
        }, 100);
      });
    }
    throw new Error('Comentario no encontrado');
  }

  async delete(id) {
    const commentIndex = this.comments.findIndex(comment => comment.id === id);
    if (commentIndex > -1) {
      this.comments.splice(commentIndex, 1);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    }
    throw new Error('Comentario no encontrado');
  }
}

export default new CommentService();