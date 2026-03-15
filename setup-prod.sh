rm -rf backends/api/prisma
rm -rf backends/data-sync/prisma
cp -r backends/prisma backends/api/prisma
cp -r backends/prisma backends/data-sync/prisma