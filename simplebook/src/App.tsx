import { useEffect, useState, lazy, Suspense } from 'react';
import { AppLayout } from './components/Layout/AppLayout';
import { ToastContainer } from './components/common/Toast';
import { Modal } from './components/common/Modal';
import { Button } from './components/common/Button';
import { initializeDefaultCategories } from './services/categoryService';
import { quickAddTransaction } from './services/transactionService';
import { useCategoryStore } from './store/categoryStore';
import { useUIStore } from './store/uiStore';
import { useTransactions } from './hooks/useTransactions';
import type { Transaction, TransactionInput, TransactionFilter } from './types/transaction';
import type { Category, CategoryInput } from './types/category';
import './styles/globals.css';

// Lazy load heavy services
const loadExportService = () => import('./services/exportService');
const loadSampleDataService = () => import('./services/sampleDataService');

// Lazy load components for code splitting
const TransactionForm = lazy(() => import('./components/TransactionForm/TransactionForm').then(m => ({ default: m.TransactionForm })));
const QuickAddForm = lazy(() => import('./components/TransactionForm/QuickAddForm').then(m => ({ default: m.QuickAddForm })));
const TransactionList = lazy(() => import('./components/TransactionList/TransactionList').then(m => ({ default: m.TransactionList })));
const FilterPanel = lazy(() => import('./components/TransactionList/FilterPanel').then(m => ({ default: m.FilterPanel })));
const DashboardView = lazy(() => import('./components/Dashboard/DashboardView').then(m => ({ default: m.DashboardView })));
const BudgetSettings = lazy(() => import('./components/Settings/BudgetSettings').then(m => ({ default: m.BudgetSettings })));
const ThemeToggle = lazy(() => import('./components/Settings/ThemeToggle').then(m => ({ default: m.ThemeToggle })));
const CategoryList = lazy(() => import('./components/Categories/CategoryList').then(m => ({ default: m.CategoryList })));
const CategoryForm = lazy(() => import('./components/Categories/CategoryForm').then(m => ({ default: m.CategoryForm })));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="text-gray-500 dark:text-gray-400">Loading...</div>
  </div>
);

type ActiveView = 'dashboard' | 'transactions' | 'categories' | 'settings';

function App() {
  const [initialized, setInitialized] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [showCategoryDeleteConfirm, setShowCategoryDeleteConfirm] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>({});
  const [loadingSampleData, setLoadingSampleData] = useState(false);

  const loadCategories = useCategoryStore((state) => state.loadCategories);
  const categories = useCategoryStore((state) => state.categories);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);
  const showToast = useUIStore((state) => state.showToast);

  const {
    transactions,
    loading,
    loadCurrentMonth,
    addTransaction,
    editTransaction,
    removeTransaction,
  } = useTransactions();

  useEffect(() => {
    async function initialize() {
      try {
        await initializeDefaultCategories();
        await loadCategories();
        await loadCurrentMonth();
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        showToast('Failed to initialize app', 'error');
      }
    }

    initialize();
  }, [loadCategories, loadCurrentMonth, showToast]);

  const handleAddTransaction = async (input: TransactionInput) => {
    try {
      await addTransaction(input);
      setIsFormOpen(false);
      setEditingTransaction(undefined);
      showToast('Transaction added successfully', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  const handleEditTransaction = async (input: TransactionInput) => {
    if (!editingTransaction?.id) return;

    try {
      await editTransaction({ id: editingTransaction.id, ...input });
      setIsFormOpen(false);
      setEditingTransaction(undefined);
      showToast('Transaction updated successfully', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  const handleQuickAdd = async (input: { amount: number }) => {
    try {
      await quickAddTransaction(input);
      await loadCurrentMonth();
      showToast('Expense added successfully', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      await removeTransaction(deletingId);
      setShowDeleteConfirm(false);
      setDeletingId(null);
      showToast('Transaction deleted successfully', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  const handleBudgetSave = () => {
    showToast('Budget updated successfully', 'success');
  };

  // Category handlers
  const handleAddCategory = async (input: CategoryInput) => {
    try {
      await addCategory(input);
      setIsCategoryFormOpen(false);
      setEditingCategory(undefined);
      showToast('Category added successfully', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  const handleEditCategory = async (input: CategoryInput) => {
    if (!editingCategory?.id) return;
    try {
      await updateCategory(editingCategory.id, input);
      setIsCategoryFormOpen(false);
      setEditingCategory(undefined);
      showToast('Category updated successfully', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  const handleCategoryEditClick = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleCategoryDeleteClick = (id: number) => {
    setDeletingCategoryId(id);
    setShowCategoryDeleteConfirm(true);
  };

  const handleCategoryDeleteConfirm = async () => {
    if (!deletingCategoryId) return;
    try {
      await deleteCategory(deletingCategoryId);
      setShowCategoryDeleteConfirm(false);
      setDeletingCategoryId(null);
      showToast('Category deleted successfully', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  const handleCloseCategoryForm = () => {
    setIsCategoryFormOpen(false);
    setEditingCategory(undefined);
  };

  // Export handler with dynamic import
  const handleExport = async () => {
    try {
      const { exportTransactionsToCSV } = await loadExportService();
      const csv = await exportTransactionsToCSV(transactions);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Transactions exported successfully', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  // Sample data handler with dynamic import
  const handleGenerateSampleData = async () => {
    try {
      const { hasSampleData, generateSampleData } = await loadSampleDataService();
      const hasData = await hasSampleData();
      if (hasData) {
        showToast('Sample data already exists. Clear data first.', 'warning');
        return;
      }
      setLoadingSampleData(true);
      await generateSampleData();
      await loadCurrentMonth();
      showToast('Sample data generated successfully', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoadingSampleData(false);
    }
  };

  // Filter handler
  const handleFilterChange = (filter: TransactionFilter) => {
    setTransactionFilter(filter);
  };

  // Apply filters to transactions
  const filteredTransactions = transactions.filter((transaction) => {
    if (transactionFilter.search) {
      const searchLower = transactionFilter.search.toLowerCase();
      if (!transaction.description?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (transactionFilter.type && transaction.type !== transactionFilter.type) {
      return false;
    }
    if (transactionFilter.categoryId && transaction.categoryId !== transactionFilter.categoryId) {
      return false;
    }
    if (transactionFilter.startDate && transaction.date < transactionFilter.startDate) {
      return false;
    }
    if (transactionFilter.endDate && transaction.date > transactionFilter.endDate) {
      return false;
    }
    return true;
  });

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-white">Loading SimpleBook...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h2>
              <Button variant="primary" onClick={() => setIsFormOpen(true)}>
                + Add Transaction
              </Button>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardView />
            </Suspense>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            {/* Quick Add Form */}
            <Suspense fallback={<LoadingSpinner />}>
              <QuickAddForm onSubmit={handleQuickAdd} />
            </Suspense>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary" onClick={() => setIsFormOpen(true)}>
                + Add Transaction
              </Button>
              <Button variant="secondary" onClick={() => setShowFilterPanel(!showFilterPanel)}>
                {showFilterPanel ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button variant="secondary" onClick={handleExport}>
                Export CSV
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
              <Suspense fallback={<LoadingSpinner />}>
                <FilterPanel
                  filter={transactionFilter}
                  onChange={handleFilterChange}
                  categories={categories}
                />
              </Suspense>
            )}

            {/* Transaction List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Transactions
                {filteredTransactions.length !== transactions.length && (
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                    ({filteredTransactions.length} of {transactions.length})
                  </span>
                )}
              </h2>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <Suspense fallback={<LoadingSpinner />}>
                  <TransactionList
                    transactions={filteredTransactions}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                </Suspense>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h2>

            {/* Theme Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <Suspense fallback={<LoadingSpinner />}>
                <ThemeToggle />
              </Suspense>
            </div>

            {/* Budget Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <Suspense fallback={<LoadingSpinner />}>
                <BudgetSettings onSave={handleBudgetSave} />
              </Suspense>
            </div>

            {/* Sample Data */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Sample Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate demo transactions for testing
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleGenerateSampleData}
                  disabled={loadingSampleData}
                >
                  {loadingSampleData ? 'Generating...' : 'Generate Data'}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Category Management
              </h2>
              <Button variant="primary" onClick={() => setIsCategoryFormOpen(true)}>
                + Add Category
              </Button>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <CategoryList
                categories={categories}
                onEdit={handleCategoryEditClick}
                onDelete={handleCategoryDeleteClick}
              />
            </Suspense>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AppLayout activeView={activeView} onNavigate={setActiveView}>
        {renderContent()}
      </AppLayout>

      {/* Transaction Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        size="md"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
            onCancel={handleCloseForm}
          />
        </Suspense>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Transaction"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDeleteConfirm} className="flex-1">
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Category Form Modal */}
      <Modal
        isOpen={isCategoryFormOpen}
        onClose={handleCloseCategoryForm}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        size="md"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <CategoryForm
            category={editingCategory}
            onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
            onCancel={handleCloseCategoryForm}
          />
        </Suspense>
      </Modal>

      {/* Category Delete Confirmation Modal */}
      <Modal
        isOpen={showCategoryDeleteConfirm}
        onClose={() => setShowCategoryDeleteConfirm(false)}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleCategoryDeleteConfirm} className="flex-1">
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setShowCategoryDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default App;
