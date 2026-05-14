import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from './store.js'

vi.mock('@/shared/api/axios.js', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() }
        }
    }
}))

import api from '@/shared/api/axios.js'

vi.mock('@/shared/utils/formDataBuilder.js', () => ({
    buildFormData: vi.fn((data) => new FormData())
}))

vi.mock('@/entities/studio/store.js', () => ({ useStudiosStore: vi.fn() }))
vi.mock('@/entities/publisher/store.js', () => ({ usePublishersStore: vi.fn() }))
vi.mock('@/entities/category/store.js', () => ({ useCategoriesStore: vi.fn() }))

import { useStudiosStore } from '@/entities/studio/store.js'
import { usePublishersStore } from '@/entities/publisher/store.js'
import { useCategoriesStore } from '@/entities/category/store.js'

describe('useGameStore', () => {
    let store

    beforeEach(() => {
        vi.clearAllMocks()

        setActivePinia(createPinia())

        useStudiosStore.mockReturnValue({
            items: [{ id: 1, name: 'Studio 1' }],
            fetchItems: vi.fn().mockResolvedValue()
        })
        usePublishersStore.mockReturnValue({
            items: [{ id: 1, name: 'Publisher 1' }],
            fetchItems: vi.fn().mockResolvedValue()
        })
        useCategoriesStore.mockReturnValue({
            items: [{ id: 1, name: 'Category 1' }],
            fetchItems: vi.fn().mockResolvedValue()
        })

        store = useGameStore()
    })

    describe('actions', () => {
        it('fetchItems: загружает список игр и обновляет состояние', async () => {
            const mockGames = [
                { id: 1, name: 'Game 1', studio_details: { id: 1 }, release_year: 2020 }
            ]

            api.get.mockResolvedValueOnce({ data: mockGames })

            await store.fetchItems()

            expect(store.items).toEqual(mockGames)
            expect(store.loading).toBe(false)
        })

        it('createItem: добавляет новую игру в список', async () => {
            const newGame = { id: 999, name: 'New Game' }
            api.post.mockResolvedValueOnce({ data: newGame })

            await store.createItem({ name: 'New Game' })

            expect(store.items).toContainEqual(newGame)
        })

        it('updateItem: обновляет существующую игру в списке', async () => {
            const initialGame = { id: 1, name: 'Old Name' }
            store.items = [initialGame]

            const updatedGame = { id: 1, name: 'Updated Name' }
            api.put.mockResolvedValueOnce({ data: updatedGame })

            await store.updateItem(1, { name: 'Updated Name' })

            expect(store.items[0]).toEqual(updatedGame)
        })

        it('deleteItem: удаляет игру из списка', async () => {
            store.items = [{ id: 1, name: 'Game 1' }]
            api.delete.mockResolvedValueOnce({})

            await store.deleteItem(1)

            expect(store.items).toHaveLength(0)
        })
    })

    describe('getters', () => {
        beforeEach(() => {
            store.items = [
                { id: 1, name: 'Game A', release_year: 2020, studio_details: { id: 1 }, categories_details: [] },
                { id: 2, name: 'Game B', release_year: 2021, studio_details: { id: 2 }, categories_details: [] }
            ]
        })

        it('filteredGames: возвращает все игры, если фильтры не заданы', () => {
            expect(store.filteredGames.items).toHaveLength(2)
        })

        it('filteredGames: применяет фильтр поиска', () => {
            store.searchQuery = 'Game A'
            expect(store.filteredGames.items).toHaveLength(1)
            expect(store.filteredGames.items[0].name).toBe('Game A')
        })

        it('latestGames: возвращает 4 последние игры, отсортированные по году выхода', () => {
            store.items = [
                { id: 1, release_year: 2019 },
                { id: 2, release_year: 2022 },
                { id: 3, release_year: 2021 },
                { id: 4, release_year: 2023 },
                { id: 5, release_year: 2020 }
            ]
            const result = store.latestGames
            expect(result).toHaveLength(4)
            expect(result[0].release_year).toBe(2023)
        })
    })
})