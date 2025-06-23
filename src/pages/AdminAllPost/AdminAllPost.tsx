import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AllAdminPost.module.css";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchAllPosts, resetPosts, setPage } from "../../redux/adminPostSlice";

const AdminAllPosts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, status, error, page, limit, total } = useSelector(
    (state: RootState) => state.adminPosts
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllPosts());
    }
  }, [status, dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const paginatedPosts = posts.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>All Posts</h2>
        <button
          onClick={() => dispatch(resetPosts())}
          className={styles.resetButton}
        >
          Reset
        </button>
      </div>
      {status === "loading" && <p className={styles.loading}>Loading...</p>}
      {status === "failed" && <p className={styles.error}>{error}</p>}
      {status === "succeeded" && posts.length === 0 && (
        <p className={styles.noData}>No posts found</p>
      )}
      {status === "succeeded" && posts.length > 0 && (
        <>
          <div className={styles.postGrid}>
            {paginatedPosts.map((post) => (
              <div key={post._id} className={styles.postCard}>
                <h3 className={styles.postTitle}>
                  {post.content.length > 50
                    ? `${post.content.slice(0, 50)}...`
                    : post.content}
                </h3>
                {post.media[0] && (
                  <img
                    src={
                      `https://dummy-project-bucket.s3.ap-south-1.amazonaws.com/` +
                      post.media[0]
                    }
                    alt="Post media"
                    className={styles.postImage}
                  />
                )}
                <p>
                  <strong>User ID:</strong> {post.UserId}
                </p>
                <p>
                  <strong>Visibility:</strong> {post.visibility}
                </p>
                <p>
                  <strong>Moderated:</strong> {post.moderated ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Reported:</strong>{" "}
                  {post.isReported
                    ? `Yes (${post.reportReason || "No reason provided"})`
                    : "No"}
                </p>
                {post.keywords && post.keywords.length > 0 && (
                  <p>
                    <strong>Keywords:</strong> {post.keywords.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className={styles.pageButton}
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAllPosts;
