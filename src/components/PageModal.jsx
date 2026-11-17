import { useState, useEffect } from 'react';

function PageModal({ page, allPages, onSave, onClose }) {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [selectedLinks, setSelectedLinks] = useState([]);

  const isEditing = !!page;

  useEffect(() => {
    if (page) {
      setUrl(page.url);
      setContent(page.content);
      setSelectedLinks(page.outgoingLinks || []);
    } else {
      setUrl('');
      setContent('');
      setSelectedLinks([]);
    }
  }, [page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || !content.trim()) return;
    onSave({
      url: url.trim(),
      content: content.trim(),
      outgoingLinks: selectedLinks,
    });
  };

  const toggleLink = (id) => {
    setSelectedLinks((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id]
    );
  };

  // Pages available for linking (exclude the page being edited)
  const linkablePages = allPages.filter((p) => !page || p.id !== page.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Page' : 'Add New Page'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Page URL</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., my-awesome-site.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Page Content / Description</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the page content with relevant keywords..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Outgoing Links (pages this page links to)</label>
            <div className="links-grid">
              {linkablePages.map((p) => (
                <label key={p.id} className={`link-checkbox ${selectedLinks.includes(p.id) ? 'link-selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedLinks.includes(p.id)}
                    onChange={() => toggleLink(p.id)}
                  />
                  <span className="link-url">{p.url}</span>
                </label>
              ))}
              {linkablePages.length === 0 && (
                <p className="no-links-text">No other pages available to link to.</p>
              )}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-save">
              {isEditing ? 'Save Changes' : 'Add Page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PageModal;

