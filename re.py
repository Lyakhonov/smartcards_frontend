import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = BASE_DIR  # os.path.join(BASE_DIR, "src")
RESULT_PATH = os.path.join(BASE_DIR, "result.txt")

# Папки для исключения
EXCLUDED_DIRS = {"public", "node_modules", ".git"}

# Файлы для исключения
EXCLUDED_FILES = {"package-lock.json", "re.py", "result.txt", ".git"}


def main():
    with open(RESULT_PATH, "w", encoding="utf-8") as out:
        for root, dirs, files in os.walk(APP_DIR):
            # Исключаем папки public и node_modules из дальнейшего обхода
            dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
            
            # Пропускаем обработку файлов в исключенных папках
            if any(excluded in root.split(os.sep) for excluded in EXCLUDED_DIRS):
                continue
            
            for filename in files:
                # Проверяем, не входит ли файл в список исключенных
                if filename in EXCLUDED_FILES:
                    continue
                    
                file_path = os.path.join(root, filename)

                # сначала пробуем прочитать файл
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                except (UnicodeDecodeError, OSError):
                    # если не получилось прочитать как текст -> пропускаем файл
                    continue

                # если всё ок, только тогда пишем заголовок и содержимое
                rel_path = os.path.relpath(file_path, BASE_DIR).replace("\\", "/")
                out.write("#" + rel_path + "\n")
                out.write(content)
                out.write("\n")


if __name__ == "__main__":
    main()