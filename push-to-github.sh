#!/bin/bash

# Скрипт для пуша кода на GitHub
# Использование: ./push-to-github.sh

set -e

echo "🚀 Push BaseFlow на GitHub"
echo ""

# Данные из запроса пользователя
GITHUB_USERNAME="Candyrout"
GITHUB_EMAIL="acimuxotot80@gmail.com"
REPO_NAME="BaseFlow"

# Запрашиваем токен (не храним в файле для безопасности)
read -p "GitHub Personal Access Token: " -s GITHUB_TOKEN
echo ""

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: Запустите скрипт из корневой директории проекта"
    exit 1
fi

# Настраиваем git config для этого репозитория
echo "📝 Настраиваю git config..."
git config --local user.name "$GITHUB_USERNAME"
git config --local user.email "$GITHUB_EMAIL"

# Проверяем, есть ли remote
if git remote get-url origin &>/dev/null; then
    echo "📍 Remote 'origin' уже существует"
    git remote set-url origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
else
    echo "📍 Добавляю remote 'origin'..."
    git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
fi

# Проверяем статус
echo ""
echo "📊 Текущий статус:"
git status --short | head -20

# Спрашиваем, нужно ли сделать коммит
if [ -n "$(git status --porcelain)" ]; then
    echo ""
    read -p "Есть незакоммиченные изменения. Сделать коммит? (y/n): " DO_COMMIT
    if [ "$DO_COMMIT" = "y" ]; then
        read -p "Сообщение коммита (Enter для 'Initial commit: BaseFlow'): " COMMIT_MSG
        COMMIT_MSG=${COMMIT_MSG:-"Initial commit: BaseFlow"}
        
        echo "📦 Добавляю файлы..."
        git add .
        
        echo "💾 Создаю коммит..."
        git commit -m "$COMMIT_MSG"
    fi
fi

# Проверяем, есть ли коммиты для push
if git rev-parse --verify HEAD &>/dev/null; then
    echo ""
    read -p "Запушить на GitHub? (y/n): " DO_PUSH
    if [ "$DO_PUSH" = "y" ]; then
        echo "🚀 Пушим на GitHub..."
        
        # Определяем текущую ветку
        BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
        
        # Создаем ветку main если её нет
        if [ "$BRANCH" = "" ]; then
            git checkout -b main
            BRANCH="main"
        fi
        
        # Пробуем push
        if git push -u origin "$BRANCH" 2>&1; then
            echo ""
            echo "✅ Успешно запушено на GitHub!"
            echo "🔗 Репозиторий: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
            
            # Удаляем токен из URL для безопасности
            echo ""
            echo "🔐 Удаляю токен из URL для безопасности..."
            git remote set-url origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
            echo "✅ Токен удален из URL"
        else
            echo ""
            echo "❌ Ошибка при push. Проверьте:"
            echo "   - Правильность токена"
            echo "   - Существует ли репозиторий на GitHub"
            echo "   - Есть ли у токена права 'repo'"
        fi
    fi
else
    echo ""
    echo "⚠️  Нет коммитов для push. Сначала сделайте коммит."
fi

echo ""
echo "✅ Готово!"
