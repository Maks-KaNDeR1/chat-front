import React, {useEffect, useRef, useState} from "react";
import {downloadFilesAsZip} from "@/src/shared/lib";
import {Button, Container, Form, Image, OverlayTrigger, Popover} from "react-bootstrap";
import {Download, Pencil, X, ThreeDotsVertical} from "react-bootstrap-icons";
import styles from "./files-block.module.css";
import {FilesBlockProps} from "./files-block.props";

export const FilesBlock = ({filesArr, onFileClick, filesFromUser}: FilesBlockProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollAmount = 250;

  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const checkScrollButtonsVisibility = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setShowLeftButton(el.scrollLeft > 0);
    setShowRightButton(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkScrollButtonsVisibility();
    const onResize = () => checkScrollButtonsVisibility();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [filesArr]);

  const onScrollLeft = () =>
    scrollRef.current?.scrollBy({left: -scrollAmount, behavior: "smooth"});
  const onScrollRight = () =>
    scrollRef.current?.scrollBy({left: scrollAmount, behavior: "smooth"});

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollBy({left: e.deltaY});
    };
    el.addEventListener("wheel", handleWheel, {passive: false});
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const onScroll = () => checkScrollButtonsVisibility();

  const toggleSelect = (idx: number) => {
    setSelectedIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) newSet.delete(idx);
      else newSet.add(idx);
      return newSet;
    });
  };

  const anySelected = selectedIndices.size > 0;

  return (
    <Container style={{position: "relative", maxWidth: "100%", margin: "auto"}}>
      {showLeftButton && (
        <Button
          onClick={onScrollLeft}
          variant="dark"
          className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
          aria-label="Scroll left"
        >
          ‹
        </Button>
      )}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          position: "relative",
        }}
        className="hide-scrollbar"
      >
        {filesArr.map((file, idx) => {
          const isSelected = selectedIndices.has(idx);
          const isImage = true;
          const fileTypeShort = file.split("/")[1];

          return (
            <span
              key={idx}
              onClick={() => isImage && onFileClick(file)}
              style={{
                display: "inline-block",
                marginRight: idx === filesArr.length - 1 ? 0 : ".45rem",
                position: "relative",
              }}
            >
              {isImage ? (
                <Image
                  src={file}
                  alt={`Image ${idx}`}
                  width={50}
                  height={60}
                  style={{
                    borderRadius: "0.25rem",
                    filter: isSelected ? "brightness(0.8)" : undefined,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className={styles.fileTypeShortBox}
                  style={{filter: isSelected ? "brightness(0.9)" : undefined}}
                  title={fileTypeShort}
                >
                  {fileTypeShort || "unknown"}
                </div>
              )}

              <Form.Check
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(idx)}
                onClick={e => e.stopPropagation()}
                aria-label={isSelected ? "Unselect" : "Select"}
                style={{position: "absolute", top: -2, right: 3, zIndex: 15}}
              />
            </span>
          );
        })}
      </div>

      {showRightButton && (
        <Button
          onClick={onScrollRight}
          size="sm"
          variant="dark"
          className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
          aria-label="Scroll right"
        >
          ›
        </Button>
      )}

      {anySelected && (
        <div
          className={`${styles.buttonsContainer} ${filesFromUser ? styles.buttonsContainerLeft : styles.buttonsContainerRight}`}
          style={{
            display: "flex",
            justifyContent: filesFromUser ? "flex-start" : "flex-end",
            gap: "0.2rem",
            marginTop: "0.1rem",
          }}
        >
          <div className="d-none d-md-flex" style={{gap: "0.2rem"}}>
            <Button
              className="round-btn"
              onClick={() => alert(`Edit ${selectedIndices.size} items`)}
              variant="outline-secondary"
            >
              <Pencil />
            </Button>
            <Button
              className="round-btn"
              onClick={() => {
                const selectedUrls = Array.from(selectedIndices).map(
                  idx => filesArr[idx]
                );
                downloadFilesAsZip(selectedUrls);
              }}
              variant="outline-secondary"
            >
              <Download />
            </Button>
            <Button
              className="round-btn"
              onClick={() => setSelectedIndices(new Set())}
              variant="outline-secondary"
            >
              <X />
            </Button>
          </div>

          <div className="d-flex d-md-none">
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              rootClose
              overlay={
                <Popover id="mobile-actions" style={{borderRadius: "0.5rem"}}>
                  <Popover.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                      padding: "0.4rem",
                    }}
                  >
                    <Button
                      className="round-btn"
                      onClick={() => alert(`Edit ${selectedIndices.size} items`)}
                      variant="outline-secondary"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      className="round-btn"
                      onClick={() => {
                        const selectedUrls = Array.from(selectedIndices).map(
                          idx => filesArr[idx]
                        );

                        console.log(selectedUrls);

                        downloadFilesAsZip(selectedUrls);
                      }}
                      variant="outline-secondary"
                    >
                      <Download />
                    </Button>
                    <Button
                      className="round-btn"
                      onClick={() => setSelectedIndices(new Set())}
                      variant="outline-secondary"
                    >
                      <X />
                    </Button>
                  </Popover.Body>
                </Popover>
              }
            >
              <Button className="round-btn" variant="outline-secondary">
                <ThreeDotsVertical />
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .popover::before,
        .popover::after {
          display: none !important; /* убираем стрелку */
        }
      `}</style>
    </Container>
  );
};
