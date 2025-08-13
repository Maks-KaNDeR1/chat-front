import React, {useEffect, useRef, useState} from "react";
import {downloadFilesAsZip} from "@/src/shared/lib";
import {Button, Container, Form, Image} from "react-bootstrap";
import {Download, Pencil, PencilSquare, X, XCircle} from "react-bootstrap-icons";
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
    const {scrollWidth, clientWidth, scrollLeft} = el;

    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    checkScrollButtonsVisibility();

    const onResize = () => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      setShowLeftButton(el.scrollLeft > 0);
      setShowRightButton(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [filesArr]);

  const onScrollLeft = (): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({left: -scrollAmount, behavior: "smooth"});
    }
  };

  const onScrollRight = (): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({left: scrollAmount, behavior: "smooth"});
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      el.scrollBy({left: e.deltaY});
    };

    el.addEventListener("wheel", handleWheel, {passive: false});

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    e.stopPropagation();
    checkScrollButtonsVisibility();
  };

  const toggleSelect = (idx: number) => {
    setSelectedIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const anySelected = selectedIndices.size > 0;

  return (
    <Container style={{position: "relative", maxWidth: "100%", margin: "auto"}}>
      {showLeftButton && (
        <Button
          onClick={onScrollLeft}
          variant="secondary"
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
          const isImage = file.type.startsWith("image/");
          const fileTypeShort = file.type.split("/")[1];

          return (
            <span
              onClick={() => {
                if (isImage) {
                  const src = file.base64.startsWith("data:")
                    ? file.base64
                    : `data:${file.type};base64,${file.base64}`;
                  onFileClick(src);
                }
              }}
              key={idx}
              style={{
                display: "inline-block",
                marginRight: idx === filesArr.length - 1 ? 0 : ".45rem",
                position: "relative",
              }}
            >
              {isImage ? (
                <Image
                  src={
                    file.base64.startsWith("data:")
                      ? file.base64
                      : `data:${file.type};base64,${file.base64}`
                  }
                  alt={`Image ${idx}`}
                  width={50}
                  height={60}
                  style={{
                    borderRadius: "0.25rem",
                    filter: isSelected ? "brightness(0.8)" : undefined,
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              ) : (
                <div
                  className={styles.fileTypeShortBox}
                  style={{
                    filter: isSelected ? "brightness(0.9)" : undefined,
                  }}
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
                style={{
                  position: "absolute",
                  top: -2,
                  right: 3,
                  zIndex: 15,
                }}
              />
            </span>
          );
        })}
      </div>

      {showRightButton && (
        <Button
          onClick={onScrollRight}
          variant="secondary"
          size="sm"
          className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
          aria-label="Scroll right"
        >
          ›
        </Button>
      )}

      {anySelected && (
        <div
          className={`${styles.buttonsContainer} ${
            filesFromUser ? styles.buttonsContainerLeft : styles.buttonsContainerRight
          }`}
          style={{
            display: "flex",
            justifyContent: filesFromUser ? "flex-start" : "flex-end",
            gap: "0.1rem",
            marginTop: "0.1rem",
          }}
        >
         <Button
  onClick={() => alert(`Edit ${selectedIndices.size} items`)}
  size="sm"
  className={styles.btnSmallCommon}
  variant="outline-secondary"
>
  <Pencil />
  Редактировать
</Button>


          <Button
            onClick={() => {
              const selectedUrls = Array.from(selectedIndices).map(
                idx => `data:${filesArr[idx].type};base64,${filesArr[idx].base64}`
              );
              downloadFilesAsZip(selectedUrls);
            }}
            size="sm"
  variant="outline-secondary"
            className={styles.btnSmallCommon}
          >
            <Download />
            Загрузить
          </Button>

          <Button
            onClick={() => setSelectedIndices(new Set())}
            size="sm"
            variant="outline-secondary"
            className={styles.btnSmallCommon}
          >
            <XCircle />
            Сбросить
          </Button>
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
      `}</style>
    </Container>
  );
};
